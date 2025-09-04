/**
 * CardLevelingService.js
 * Handles card leveling, merging, and rarity progression with stat evolution
 *
 * Key Features:
 * - 1.5% stat increase per level (replacing old 10% system)
 * - Rarity jump multipliers: COMMON→RARE (1.4x), RARE→EPIC (1.3x), LEGENDARY→MYTHIC (1.4x)
 * - Custom base stats stored in UserCharacter table
 * - Level cap of 100 with rarity upgrade system
 * - DIMENSIONAL characters are event-only and cannot be upgraded
 */

const { models } = require('../database/connection');
const { RARITY_UPGRADE_THRESHOLDS, RARITY_GROUPS, LEVEL_CAPS } = require('../config/constants');

class CardLevelingService {
    constructor() {
        // EXP required for each level (cumulative)
        this.levelExpRequirements = this.generateLevelExpRequirements();

        // Rarity progression order
        this.rarityProgression = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIMENSIONAL'];

        // Rarity jump multipliers for upgrades (applied to base stats)
        this.rarityJumpMultipliers = {
            'COMMON_to_RARE': 1.35,     // COMMON → RARE: Slightly reduced to 1.35x for balance
            'RARE_to_EPIC': 1.25,       // RARE → EPIC: Reduced to 1.25x to prevent stat inflation
            'LEGENDARY_to_MYTHIC': 1.3  // LEGENDARY → MYTHIC: Reduced to 1.3x for endgame balance
        };

        // Import rarity groups and level caps
        this.rarityGroups = RARITY_GROUPS;
        this.levelCaps = LEVEL_CAPS;
    }

    /**
     * Generate EXP requirements for each level
     * Level 1: 0 EXP
     * Level 2: 100 EXP
     * Level 3: 250 EXP
     * And so on with increasing requirements
     */
    generateLevelExpRequirements() {
        const requirements = { 1: 0 };
        let baseExp = 100;

        for (let level = 2; level <= 100; level++) {
            // Exponential growth: each level requires 25% more EXP than the previous
            requirements[level] = requirements[level - 1] + Math.floor(baseExp);
            baseExp = Math.floor(baseExp * 1.25);
        }

        return requirements;
    }

    /**
     * Calculate EXP gained from merging a duplicate card
     * @param {Object} character - Character data
     * @param {number} duplicateLevel - Level of the duplicate card being merged
     * @returns {number} EXP gained
     */
    calculateMergeExp(character, duplicateLevel) {
        // Base EXP from rarity
        const rarityMultipliers = {
            'COMMON': 50,
            'RARE': 100,
            'EPIC': 200,
            'LEGENDARY': 400,
            'MYTHIC': 800,
            'DIMENSIONAL': 1600
        };

        const baseExp = rarityMultipliers[character.rarity] || 50;

        // Level bonus: higher level duplicates give more EXP
        const levelBonus = duplicateLevel * 10;

        // Random bonus (80-120% of base)
        const randomBonus = Math.floor(Math.random() * 0.4 * baseExp) + Math.floor(baseExp * 0.8);

        return baseExp + levelBonus + randomBonus;
    }

    /**
     * Merge a duplicate card into an existing card
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @param {number} duplicateLevel - Level of the duplicate being merged
     * @returns {Object} Merge result
     */
    async mergeDuplicateCard(userId, characterId, duplicateLevel = 1) {
        const transaction = await models.sequelize.transaction();
        try {
            // Optimize query: Select only necessary fields
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                attributes: ['id', 'customLevel', 'customExp'],
                include: [{
                    model: models.Character,
                    as: 'character',
                    attributes: ['id', 'attack', 'defense', 'speed', 'health', 'rarity']
                }],
                transaction
            });

            if (!userCharacter) {
                throw new Error('Character not found or user does not own this character.');
            }

            // Construct baseStats object from separate columns
            userCharacter.character.baseStats = {
                attack: userCharacter.character.attack,
                defense: userCharacter.character.defense,
                speed: userCharacter.character.speed,
                health: userCharacter.character.health
            };

            if (userCharacter.customLevel >= 100) {
                await transaction.rollback();
                return {
                    success: false,
                    error: 'Character is already at max level.'
                };
            }

            // Calculate EXP gained from merge with reduced randomness
            const baseExp = this.calculateMergeExp(userCharacter.character, duplicateLevel);
            const expGained = Math.floor(baseExp * 1.1); // Fixed 10% bonus for predictability

            // Add EXP to the character
            const levelingResult = await this.addExpToCard(userId, characterId, expGained, transaction);

            await transaction.commit();

            return {
                success: true,
                expGained,
                ...levelingResult,
                message: `Successfully merged duplicate card! Gained ${expGained} EXP. Level: ${levelingResult.newLevel}, Stats: ${JSON.stringify(levelingResult.newStats)}`
            };

        } catch (error) {
            await transaction.rollback();
            console.error('Error merging duplicate card:', error);
            return {
                success: false,
                error: error.message || 'An unexpected error occurred during the merge.'
            };
        }
    }

    /**
     * Add EXP to a card and handle leveling up
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @param {number} expAmount - Amount of EXP to add
     * @returns {Object} Leveling result
     */
    async addExpToCard(userId, characterId, expAmount, transaction = null) {
        try {
            // Optimize query: Select only necessary fields
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                attributes: ['id', 'customLevel', 'customExp'],
                include: [{
                    model: models.Character,
                    as: 'character',
                    attributes: ['id', 'attack', 'defense', 'speed', 'health', 'rarity']
                }],
                transaction
            });

            if (!userCharacter) {
                throw new Error('Character not found or user does not own this character.');
            }

            // Construct baseStats object from separate columns
            userCharacter.character.baseStats = {
                attack: userCharacter.character.attack,
                defense: userCharacter.character.defense,
                speed: userCharacter.character.speed,
                health: userCharacter.character.health
            };

            const currentLevel = userCharacter.customLevel;
            const currentExp = userCharacter.customExp;
            const newExp = currentExp + expAmount;

            let newLevel = currentLevel;
            let leveledUp = false;
            let levelsGained = 0;

            // Adjust EXP curve for higher levels
            while (newLevel < 100 && newExp >= this.levelExpRequirements[newLevel + 1]) {
                newLevel++;
                levelsGained++;
                leveledUp = true;
            }

            // Cap EXP at level 100 requirement
            const maxExp = this.levelExpRequirements[100];
            const finalExp = Math.min(newExp, maxExp);

            // Update the database
            await userCharacter.update({
                customLevel: newLevel,
                customExp: finalExp
            }, { transaction });

            // Apply diminishing returns for stats at higher levels
            const scalingFactor = 0.015 - (newLevel > 50 ? (newLevel - 50) * 0.0001 : 0);
            const levelMultiplier = 1 + (newLevel - 1) * scalingFactor;
            const newStats = {
                attack: Math.floor(userCharacter.character.baseStats.attack * levelMultiplier),
                defense: Math.floor(userCharacter.character.baseStats.defense * levelMultiplier),
                speed: Math.floor(userCharacter.character.baseStats.speed * levelMultiplier),
                health: Math.floor(userCharacter.character.baseStats.health * levelMultiplier)
            };

            // Check for rarity upgrade if reached level 100
            let rarityUpgrade = null;
            if (newLevel >= 100) {
                rarityUpgrade = await this.checkRarityUpgrade(userId, characterId, transaction);
            }

            return {
                success: true,
                newLevel,
                newExp: finalExp,
                newStats,
                leveledUp,
                levelsGained,
                rarityUpgrade
            };

        } catch (error) {
            console.error('Error adding EXP to card:', error);
            throw new Error(error.message || 'An unexpected error occurred while adding EXP.');
        }
    }

    /**
     * Check if a card can upgrade to the next rarity
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @param {Object} transaction - Database transaction
     * @returns {Object|null} Rarity upgrade result or null
     */
    async checkRarityUpgrade(userId, characterId, transaction = null) {
        try {
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }],
                transaction
            });

            if (!userCharacter || userCharacter.customLevel < 100) {
                return null;
            }

            const currentRarity = userCharacter.character.rarity;

            // DIMENSIONAL characters cannot be upgraded further
            if (currentRarity === 'DIMENSIONAL') {
                return null;
            }

            // Check if character is in BASIC group (COMMON-RARE-EPIC)
            if (this.rarityGroups.BASIC.includes(currentRarity)) {
                // If at EPIC, no further rarity upgrades
                if (currentRarity === this.levelCaps.BASIC_MAX_RARITY) {
                    return null;
                }
                // Allow upgrade within BASIC group
                const currentIndex = this.rarityProgression.indexOf(currentRarity);
                const nextIndex = currentIndex + 1;
                if (nextIndex < this.rarityProgression.length && this.rarityGroups.BASIC.includes(this.rarityProgression[nextIndex])) {
                    const nextRarity = this.rarityProgression[nextIndex];
                    const shardCost = RARITY_UPGRADE_THRESHOLDS[nextRarity] || 1000;

                    // Check if user has enough shards
                    const user = await models.User.findByPk(userId);
                    if (user && user.shards >= shardCost) {
                        return {
                            canUpgrade: true,
                            nextRarity,
                            shardCost,
                            currentShards: user.shards
                        };
                    } else {
                        return {
                            canUpgrade: false,
                            nextRarity,
                            shardCost,
                            currentShards: user.shards,
                            shardsNeeded: shardCost - (user?.shards || 0)
                        };
                    }
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
                const currentIndex = this.rarityProgression.indexOf(currentRarity);
                const nextIndex = currentIndex + 1;
                if (nextIndex < this.rarityProgression.length && this.rarityGroups.ADVANCED.includes(this.rarityProgression[nextIndex])) {
                    const nextRarity = this.rarityProgression[nextIndex];
                    const shardCost = RARITY_UPGRADE_THRESHOLDS[nextRarity] || 1000;

                    // Check if user has enough shards
                    const user = await models.User.findByPk(userId);
                    if (user && user.shards >= shardCost) {
                        return {
                            canUpgrade: true,
                            nextRarity,
                            shardCost,
                            currentShards: user.shards
                        };
                    } else {
                        return {
                            canUpgrade: false,
                            nextRarity,
                            shardCost,
                            currentShards: user.shards,
                            shardsNeeded: shardCost - (user?.shards || 0)
                        };
                    }
                }
                return null;
            }

            // For DIMENSIONAL or any other rarities, no upgrades
            return null;

        } catch (error) {
            console.error('Error checking rarity upgrade:', error);
            return null;
        }
    }

    /**
     * Upgrade a card to the next rarity with stat evolution
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @returns {Object} Upgrade result
     */
    async upgradeRarity(userId, characterId) {
        try {
            const upgradeCheck = await this.checkRarityUpgrade(userId, characterId);

            if (!upgradeCheck || !upgradeCheck.canUpgrade) {
                throw new Error('Cannot upgrade rarity: insufficient shards or not eligible');
            }

            // Get user and deduct shards
            const user = await models.User.findByPk(userId);
            await user.update({
                shards: user.shards - upgradeCheck.shardCost
            });

            // Get the user character and original character data
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }]
            });

            if (!userCharacter) {
                throw new Error('User character not found');
            }

            const currentRarity = userCharacter.character.rarity;
            const nextRarity = upgradeCheck.nextRarity;

            // Calculate rarity jump multiplier
            const jumpKey = `${currentRarity}_to_${nextRarity}`;
            const jumpMultiplier = this.rarityJumpMultipliers[jumpKey] || 1.0;

            // Get current base stats (use custom stats if available, otherwise original)
            const currentBaseStats = {
                attack: userCharacter.customAttack ?? userCharacter.character.attack,
                defense: userCharacter.customDefense ?? userCharacter.character.defense,
                speed: userCharacter.customSpeed ?? userCharacter.character.speed,
                health: userCharacter.customHealth ?? userCharacter.character.health
            };

            // Apply rarity jump multiplier to create new base stats
            const newBaseStats = {
                attack: Math.floor(currentBaseStats.attack * jumpMultiplier),
                defense: Math.floor(currentBaseStats.defense * jumpMultiplier),
                speed: Math.floor(currentBaseStats.speed * jumpMultiplier),
                health: Math.floor(currentBaseStats.health * jumpMultiplier)
            };

            // Reset level and EXP for new rarity, and update custom stats
            await userCharacter.update({
                customLevel: 1,
                customExp: 0,
                collectedShards: 0,
                customAttack: newBaseStats.attack,
                customDefense: newBaseStats.defense,
                customSpeed: newBaseStats.speed,
                customHealth: newBaseStats.health
            });

            return {
                success: true,
                oldRarity: currentRarity,
                newRarity: nextRarity,
                shardsSpent: upgradeCheck.shardCost,
                oldBaseStats: currentBaseStats,
                newBaseStats: newBaseStats,
                jumpMultiplier: jumpMultiplier
            };

        } catch (error) {
            console.error('Error upgrading rarity:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate scaled stats for a leveled card using the new evolution system
     * Formula: currentBaseStat * (1 + (level - 1) * 0.015)
     * @param {Object} character - Base character data
     * @param {number} customLevel - Current custom level
     * @param {Object} userCharacter - UserCharacter data (optional, for custom stats)
     * @returns {Object} Scaled stats
     */
    calculateScaledStats(character, customLevel, userCharacter = null) {
        // New scaling factor: 1.5% increase per level (instead of 10%)
        const scalingFactor = 0.015;
        const levelMultiplier = 1 + (customLevel - 1) * scalingFactor;

        // Use custom stats if available (from rarity upgrades), otherwise use original stats
        const baseAttack = userCharacter?.customAttack ?? character.attack;
        const baseDefense = userCharacter?.customDefense ?? character.defense;
        const baseSpeed = userCharacter?.customSpeed ?? character.speed;
        const baseHealth = userCharacter?.customHealth ?? character.health;

        return {
            attack: Math.floor(baseAttack * levelMultiplier),
            defense: Math.floor(baseDefense * levelMultiplier),
            speed: Math.floor(baseSpeed * levelMultiplier),
            health: Math.floor(baseHealth * levelMultiplier)
        };
    }

    /**
     * Get leveling progress for a card
     * @param {string} userId - User ID
     * @param {string} characterId - Character ID
     * @returns {Object} Leveling progress data
     */
    async getLevelingProgress(userId, characterId) {
        try {
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }]
            });

            if (!userCharacter) {
                throw new Error('User does not own this character');
            }

            const currentLevel = userCharacter.customLevel;
            const currentExp = userCharacter.customExp;

            const expForCurrentLevel = this.levelExpRequirements[currentLevel];
            const expForNextLevel = this.levelExpRequirements[currentLevel + 1] || this.levelExpRequirements[100];
            const expNeeded = expForNextLevel - expForCurrentLevel;
            const expProgress = currentExp - expForCurrentLevel;

            const progressPercentage = Math.min((expProgress / expNeeded) * 100, 100);

            return {
                currentLevel,
                currentExp,
                expForNextLevel: currentLevel < 100 ? expForNextLevel : null,
                expNeeded: currentLevel < 100 ? expNeeded : 0,
                expProgress,
                progressPercentage,
                isMaxLevel: currentLevel >= 100,
                scaledStats: this.calculateScaledStats(userCharacter.character, currentLevel, userCharacter)
            };

        } catch (error) {
            console.error('Error getting leveling progress:', error);
            throw error;
        }
    }
}

module.exports = CardLevelingService;
