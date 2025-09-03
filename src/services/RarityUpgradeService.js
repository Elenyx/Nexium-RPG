/**
 * @file RarityUpgradeService.js
 * @description Service for managing character rarity upgrades
 * @author Nexium Bot Development Team
 */

const { models } = require('../database/connection');
const ShardService = require('./ShardService');
const { RARITY_UPGRADE_THRESHOLDS, RARITY_ORDER, RARITY_GROUPS, LEVEL_CAPS } = require('../config/constants');
const logger = require('../utils/logger');

class RarityUpgradeService {
    constructor() {
        this.shardService = new ShardService();
        this.rarityOrder = RARITY_ORDER;
        this.upgradeThresholds = RARITY_UPGRADE_THRESHOLDS;
        this.rarityGroups = RARITY_GROUPS;
        this.levelCaps = LEVEL_CAPS;
    }

    /**
     * Get the next rarity for a character
     * @param {string} currentRarity - Current rarity
     * @returns {string|null} Next rarity or null if max tier for that group
     */
    getNextRarity(currentRarity) {
        const currentIndex = this.rarityOrder.indexOf(currentRarity);
        if (currentIndex === -1) {
            return null; // Invalid rarity
        }

        // Check if character is in BASIC group (COMMON-RARE-EPIC)
        if (this.rarityGroups.BASIC.includes(currentRarity)) {
            // If at EPIC, no further rarity upgrades
            if (currentRarity === this.levelCaps.BASIC_MAX_RARITY) {
                return null;
            }
            // Allow upgrade within BASIC group
            const nextIndex = currentIndex + 1;
            if (nextIndex < this.rarityOrder.length && this.rarityGroups.BASIC.includes(this.rarityOrder[nextIndex])) {
                return this.rarityOrder[nextIndex];
            }
            return null;
        }

        // Check if character is in ADVANCED group (LEGENDARY-MYTHIC)
        if (this.rarityGroups.ADVANCED.includes(currentRarity)) {
            // If at MYTHIC, no further rarity upgrades
            if (currentRarity === this.levelCaps.ADVANCED_MAX_RARITY) {
                return null;
            }
            // Allow upgrade within ADVANCED group
            const nextIndex = currentIndex + 1;
            if (nextIndex < this.rarityOrder.length && this.rarityGroups.ADVANCED.includes(this.rarityOrder[nextIndex])) {
                return this.rarityOrder[nextIndex];
            }
            return null;
        }

        // For DIMENSIONAL or any other rarities, no upgrades
        return null;
    }

    /**
     * Get the rarity group for a character
     * @param {string} rarity - Character rarity
     * @returns {string} Group name ('BASIC', 'ADVANCED', or 'SPECIAL')
     */
    getRarityGroup(rarity) {
        if (this.rarityGroups.BASIC.includes(rarity)) {
            return 'BASIC';
        }
        if (this.rarityGroups.ADVANCED.includes(rarity)) {
            return 'ADVANCED';
        }
        return 'SPECIAL'; // DIMENSIONAL or other special rarities
    }

    /**
     * Get the level cap for a character's rarity group
     * @param {string} rarity - Character rarity
     * @returns {number} Level cap for that group
     */
    getLevelCapForRarity(rarity) {
        const group = this.getRarityGroup(rarity);
        if (group === 'BASIC') {
            return this.levelCaps.BASIC_LEVEL_CAP;
        }
        if (group === 'ADVANCED') {
            return this.levelCaps.ADVANCED_LEVEL_CAP;
        }
        return 1; // No leveling for special rarities
    }

    /**
     * Get the shard threshold for upgrading to the next rarity
     * @param {string} currentRarity - Current rarity
     * @returns {number} Shard threshold needed
     */
    getUpgradeThreshold(currentRarity) {
        return this.upgradeThresholds[currentRarity] || 0;
    }

    /**
     * Check if a character can be upgraded to the next rarity
     * @param {Object} userCharacter - UserCharacter instance
     * @returns {boolean} Whether upgrade is possible
     */
    canUpgradeRarity(userCharacter) {
        const nextRarity = this.getNextRarity(userCharacter.character.rarity);
        if (!nextRarity) return false;

        const threshold = this.getUpgradeThreshold(userCharacter.character.rarity);
        return userCharacter.collectedShards >= threshold;
    }

    /**
     * Add shards to a character's rarity upgrade progress
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @param {number} shardAmount - Amount of shards to add
     * @returns {Object} Updated user character
     */
    async addShardsToRarityUpgrade(userId, characterId, shardAmount) {
        if (!models) {
            logger.warn('Database not available, cannot add shards to rarity upgrade');
            return null;
        }

        try {
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{ model: models.Character, as: 'character' }]
            });

            if (!userCharacter) {
                throw new Error('User character not found');
            }

            // Update collected shards
            const newCollectedShards = userCharacter.collectedShards + shardAmount;
            await userCharacter.update({
                collectedShards: newCollectedShards,
                nextRarityThreshold: this.getUpgradeThreshold(userCharacter.character.rarity)
            });

            logger.info(`Added ${shardAmount} shards to rarity upgrade for character ${characterId}. New total: ${newCollectedShards}`);
            return userCharacter;
        } catch (error) {
            logger.error('Error in addShardsToRarityUpgrade:', error);
            throw error;
        }
    }

    /**
     * Perform a rarity upgrade for a character
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @returns {Object} Upgrade result
     */
    async performRarityUpgrade(userId, characterId) {
        if (!models) {
            logger.warn('Database not available, cannot perform rarity upgrade');
            return null;
        }

        try {
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{ model: models.Character, as: 'character' }]
            });

            if (!userCharacter) {
                throw new Error('User character not found');
            }

            const currentRarity = userCharacter.character.rarity;
            const nextRarity = this.getNextRarity(currentRarity);

            if (!nextRarity) {
                throw new Error('Character is already at maximum rarity');
            }

            if (!this.canUpgradeRarity(userCharacter)) {
                throw new Error('Insufficient shards collected for rarity upgrade');
            }

            // Update character's rarity
            await models.Character.update(
                { rarity: nextRarity },
                { where: { id: characterId } }
            );

            // Update character's imageUrl to match new rarity if imageUrls are available
            if (userCharacter.character.imageUrls && userCharacter.character.imageUrls[nextRarity]) {
                await models.Character.update(
                    { imageUrl: userCharacter.character.imageUrls[nextRarity] },
                    { where: { id: characterId } }
                );
            }

            // Reset collected shards and update threshold for new rarity
            const newThreshold = this.getUpgradeThreshold(nextRarity);
            await userCharacter.update({
                collectedShards: 0,
                nextRarityThreshold: newThreshold
            });

            // Calculate stat bonuses from rarity upgrade
            const statMultiplier = this.getRarityStatMultiplier(nextRarity) / this.getRarityStatMultiplier(currentRarity);

            // Update character stats
            const character = userCharacter.character;
            const newStats = {
                attack: Math.floor(character.attack * statMultiplier),
                defense: Math.floor(character.defense * statMultiplier),
                speed: Math.floor(character.speed * statMultiplier),
                health: Math.floor(character.health * statMultiplier)
            };

            await models.Character.update(newStats, { where: { id: characterId } });

            logger.info(`Upgraded character ${characterId} from ${currentRarity} to ${nextRarity}`);

            return {
                success: true,
                oldRarity: currentRarity,
                newRarity: nextRarity,
                oldStats: {
                    attack: character.attack,
                    defense: character.defense,
                    speed: character.speed,
                    health: character.health
                },
                newStats,
                shardsUsed: userCharacter.collectedShards
            };
        } catch (error) {
            logger.error('Error in performRarityUpgrade:', error);
            throw error;
        }
    }

    /**
     * Get stat multiplier for a rarity
     * @param {string} rarity - Character rarity
     * @returns {number} Stat multiplier
     */
    getRarityStatMultiplier(rarity) {
        const multipliers = {
            'COMMON': 1.0,
            'RARE': 1.2,
            'EPIC': 1.5,
            'LEGENDARY': 1.8,
            'MYTHIC': 2.2,
            'DIMENSIONAL': 2.5
        };
        return multipliers[rarity] || 1.0;
    }

    /**
     * Get rarity upgrade progress for a character
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @returns {Object} Progress information
     */
    async getRarityUpgradeProgress(userId, characterId) {
        if (!models) {
            logger.warn('Database not available, cannot get rarity upgrade progress');
            return null;
        }

        try {
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{ model: models.Character, as: 'character' }]
            });

            if (!userCharacter) {
                return null;
            }

            const currentRarity = userCharacter.character.rarity;
            const nextRarity = this.getNextRarity(currentRarity);
            const threshold = this.getUpgradeThreshold(currentRarity);
            const collected = userCharacter.collectedShards;
            const progress = threshold > 0 ? (collected / threshold) * 100 : 100;

            return {
                currentRarity,
                nextRarity,
                collectedShards: collected,
                requiredShards: threshold,
                progress: Math.min(progress, 100),
                canUpgrade: this.canUpgradeRarity(userCharacter)
            };
        } catch (error) {
            logger.error('Error in getRarityUpgradeProgress:', error);
            return null;
        }
    }
}

module.exports = RarityUpgradeService;
