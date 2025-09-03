/**
 * @file ShardService.js
 * @description Service for managing user shards and shard-related operations
 * @author Nexium Bot Development Team
 */

const { models } = require('../database/connection');
const logger = require('../utils/logger');

class ShardService {
    /**
     * Add shards to a user
     * @param {string} userId - User ID
     * @param {number} amount - Amount of shards to add
     * @param {string} reason - Reason for adding shards
     * @returns {Object} Updated user object
     */
    async addShards(userId, amount, reason = 'Unknown') {
        if (!models) {
            logger.warn('Database not available, cannot add shards');
            return null;
        }

        try {
            const user = await models.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const newShards = user.shards + amount;
            await user.update({ shards: newShards });

            logger.info(`Added ${amount} shards to user ${userId} (${reason}). New total: ${newShards}`);
            return user;
        } catch (error) {
            logger.error('Error in addShards:', error);
            throw error;
        }
    }

    /**
     * Remove shards from a user
     * @param {string} userId - User ID
     * @param {number} amount - Amount of shards to remove
     * @param {string} reason - Reason for removing shards
     * @returns {Object} Updated user object
     */
    async removeShards(userId, amount, reason = 'Unknown') {
        if (!models) {
            logger.warn('Database not available, cannot remove shards');
            return null;
        }

        try {
            const user = await models.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            if (user.shards < amount) {
                throw new Error('Insufficient shards');
            }

            const newShards = user.shards - amount;
            await user.update({ shards: newShards });

            logger.info(`Removed ${amount} shards from user ${userId} (${reason}). New total: ${newShards}`);
            return user;
        } catch (error) {
            logger.error('Error in removeShards:', error);
            throw error;
        }
    }

    /**
     * Get user's shard balance
     * @param {string} userId - User ID
     * @returns {number} User's shard balance
     */
    async getShardBalance(userId) {
        if (!models) {
            logger.warn('Database not available, returning 0 shards');
            return 0;
        }

        try {
            const user = await models.User.findByPk(userId);
            return user ? user.shards : 0;
        } catch (error) {
            logger.error('Error in getShardBalance:', error);
            return 0;
        }
    }

    /**
     * Award shards for completing quests
     * @param {string} userId - User ID
     * @param {string} questType - Type of quest (daily, main_story, side_quest, etc.)
     * @param {number} baseReward - Base shard reward
     * @returns {Object} Result with awarded amount and new balance
     */
    async awardQuestShards(userId, questType, baseReward) {
        const multipliers = {
            'daily': 1.0,
            'main_story': 2.5,
            'side_quest': 1.5,
            'event': 3.0,
            'achievement': 2.0
        };

        const multiplier = multipliers[questType] || 1.0;
        const finalReward = Math.floor(baseReward * multiplier);

        const user = await this.addShards(userId, finalReward, `Quest completion: ${questType}`);

        return {
            awarded: finalReward,
            newBalance: user.shards,
            questType,
            multiplier
        };
    }

    /**
     * Get shard requirements for character upgrades
     * @param {string} rarity - Character rarity
     * @param {number} currentLevel - Current character level
     * @returns {number} Shards required for next level
     */
    getUpgradeCost(rarity, currentLevel) {
        const baseCosts = {
            'COMMON': 10,
            'RARE': 25,
            'EPIC': 50,
            'LEGENDARY': 100,
            'MYTHIC': 200
        };

        const baseCost = baseCosts[rarity] || 10;
        const levelMultiplier = 1 + (currentLevel * 0.1); // 10% increase per level

        return Math.floor(baseCost * levelMultiplier);
    }

    /**
     * Calculate total shards needed to reach target level
     * @param {string} rarity - Character rarity
     * @param {number} currentLevel - Current level
     * @param {number} targetLevel - Target level
     * @returns {number} Total shards needed
     */
    getTotalUpgradeCost(rarity, currentLevel, targetLevel) {
        let totalCost = 0;

        for (let level = currentLevel; level < targetLevel; level++) {
            totalCost += this.getUpgradeCost(rarity, level);
        }

        return totalCost;
    }
}

module.exports = ShardService;
