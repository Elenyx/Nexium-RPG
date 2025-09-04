/**
 * @file GachaService.js
 * @description Advanced gacha system with rarity mechanics and improved pull systems
 * @author Nexium Bot Development Team
 */

const { models } = require('../database/connection');
const UserService = require('./UserService');
const CardLevelingService = require('./CardLevelingService');
const logger = require('../utils/logger');

class GachaService {
    constructor() {
        this.userService = new UserService();
        this.cardLevelingService = new CardLevelingService();

        // Gacha rates (in percentage) - DIMENSIONAL removed from regular pulls
        this.rates = {
            COMMON: 47.7,
            RARE: 30.2,
            EPIC: 15.1,
            LEGENDARY: 5.0,
            MYTHIC: 2.0
        };

        // Pity system configuration - DIMENSIONAL removed from pity system
        this.pityConfig = {
            softPityStart: 50,  // After 50 pulls, start increasing rates
            hardPity: 100,      // Guaranteed high-rarity at 100 pulls
            highRarityThreshold: ['LEGENDARY', 'MYTHIC'], // DIMENSIONAL removed - only obtainable via events
            pityBonus: {
                LEGENDARY: 2.0,  // 2x rate increase for LEGENDARY
                MYTHIC: 3.0      // 3x rate increase for MYTHIC
            }
        };

        // Pull costs
        this.costs = {
            single: 100,
            multi: 900, // 10 pulls for 900 (10% discount)
            premium: 500 // Premium currency pull
        };
    }

    /**
     * Perform a single pull
     * @param {string} userId - User ID
     * @param {string} username - Username
     * @returns {Object} Pull result
     */
    async singlePull(userId, username) {
        return this.performPull(userId, username, 1, this.costs.single);
    }

    /**
     * Perform multiple pulls (10 pulls)
     * @param {string} userId - User ID
     * @param {string} username - Username
     * @returns {Object} Pull results
     */
    async multiPull(userId, username) {
        return this.performPull(userId, username, 10, this.costs.multi);
    }

    /**
     * Perform pulls with specified parameters
     * @param {string} userId - User ID
     * @param {string} username - Username
     * @param {number} amount - Number of pulls
     * @param {number} cost - Total cost
     * @returns {Object} Pull results
     */
    async performPull(userId, username, amount, cost) {
        if (!models) {
            throw new Error('Database not available');
        }

        try {
            // Get user
            const user = await this.userService.getOrCreateUser(userId, username);

            // Check if user has enough coins
            if (user.coins < cost) {
                throw new Error(`Insufficient coins. Need ${cost}, have ${user.coins}`);
            }

            // Get all available characters (excluding DIMENSIONAL for regular pulls)
            const characters = await models.Character.findAll({
                where: {
                    rarity: {
                        [models.Sequelize.Op.ne]: 'DIMENSIONAL' // Exclude DIMENSIONAL characters
                    }
                }
            });
            if (characters.length === 0) {
                throw new Error('No characters available for pulling');
            }

            // Perform pulls
            const results = [];
            let totalSpent = 0;

            for (let i = 0; i < amount; i++) {
                const result = await this.performSinglePull(userId, characters);
                results.push(result);
                totalSpent += this.costs.single;
            }

            // Deduct coins
            await this.userService.updateUser(userId, { coins: user.coins - cost });

            // Calculate statistics
            const stats = this.calculatePullStats(results);

            return {
                success: true,
                results,
                stats,
                cost,
                newBalance: user.coins - cost,
                amount
            };

        } catch (error) {
            logger.error('Error in performPull:', error);
            throw error;
        }
    }

    /**
     * Perform a single character pull
     * @param {string} userId - User ID
     * @param {Array} characters - Available characters
     * @returns {Object} Pull result
     */
    async performSinglePull(userId, characters) {
        // Get user's current pity counter
        const user = await this.userService.getUserById(userId);
        let pityCounter = user.pityCounter || 0;

        // Calculate pity-adjusted rates
        const adjustedRates = this.calculatePityRates(pityCounter);

        // Generate random number for rarity determination
        const random = Math.random() * 100;
        let cumulativeRate = 0;
        let selectedRarity = 'COMMON';

        // Determine rarity based on adjusted rates
        for (const [rarity, rate] of Object.entries(adjustedRates)) {
            cumulativeRate += rate;
            if (random <= cumulativeRate) {
                selectedRarity = rarity;
                break;
            }
        }

        // Hard pity guarantee
        if (pityCounter >= this.pityConfig.hardPity) {
            const highRarityOptions = this.pityConfig.highRarityThreshold;
            selectedRarity = highRarityOptions[Math.floor(Math.random() * highRarityOptions.length)];
        }

        // Filter characters by selected rarity
        const rarityCharacters = characters.filter(char => char.rarity === selectedRarity);

        if (rarityCharacters.length === 0) {
            // Fallback to any character if no characters of selected rarity
            const fallbackChar = characters[Math.floor(Math.random() * characters.length)];
            const result = await this.userService.addCharacterToUser(userId, fallbackChar.id);

            // Handle merging if it's a duplicate
            let mergeResult = null;
            if (!result.isNewlyCreated) {
                mergeResult = await this.cardLevelingService.mergeDuplicateCard(
                    userId,
                    fallbackChar.id,
                    1
                );
            }

            // Update pity counter
            await this.updatePityCounter(userId, fallbackChar.rarity);

            return {
                character: fallbackChar,
                rarity: fallbackChar.rarity,
                isNew: result.isNewlyCreated,
                isDuplicate: !result.isNewlyCreated,
                mergeResult: mergeResult,
                pityCounter: pityCounter + 1
            };
        }

        // Select random character from the rarity pool
        const selectedCharacter = rarityCharacters[Math.floor(Math.random() * rarityCharacters.length)];
        const result = await this.userService.addCharacterToUser(userId, selectedCharacter.id);

        // Handle merging if it's a duplicate
        let mergeResult = null;
        if (!result.isNewlyCreated) {
            // This is a duplicate - merge it for EXP
            mergeResult = await this.cardLevelingService.mergeDuplicateCard(
                userId,
                selectedCharacter.id,
                1 // Default level for pulled duplicates
            );
        }

        // Update pity counter
        await this.updatePityCounter(userId, selectedRarity);

        return {
            character: selectedCharacter,
            rarity: selectedRarity,
            isNew: result.isNewlyCreated,
            isDuplicate: !result.isNewlyCreated,
            mergeResult: mergeResult,
            pityCounter: pityCounter + 1
        };
    }

    /**
     * Calculate pity-adjusted rates based on current pity counter
     * @param {number} pityCounter - Current pity counter
     * @returns {Object} Adjusted rarity rates
     */
    calculatePityRates(pityCounter) {
        const adjustedRates = { ...this.rates };

        if (pityCounter >= this.pityConfig.softPityStart) {
            // Apply pity bonuses for high-rarity characters
            const pityProgress = (pityCounter - this.pityConfig.softPityStart) /
                               (this.pityConfig.hardPity - this.pityConfig.softPityStart);

            for (const [rarity, bonus] of Object.entries(this.pityConfig.pityBonus)) {
                const baseRate = this.rates[rarity];
                const bonusRate = baseRate * (bonus - 1) * pityProgress;
                adjustedRates[rarity] = Math.min(baseRate + bonusRate, 50); // Cap at 50%
            }

            // Reduce lower rarity rates proportionally
            const totalBonus = Object.entries(this.pityConfig.pityBonus)
                .reduce((sum, [rarity, bonus]) => {
                    const baseRate = this.rates[rarity];
                    const pityProgress = (pityCounter - this.pityConfig.softPityStart) /
                                       (this.pityConfig.hardPity - this.pityConfig.softPityStart);
                    return sum + (baseRate * (bonus - 1) * pityProgress);
                }, 0);

            // Distribute the reduction among lower rarities
            const lowerRarities = ['COMMON', 'RARE', 'EPIC'];
            const reductionPerRarity = totalBonus / lowerRarities.length;

            lowerRarities.forEach(rarity => {
                adjustedRates[rarity] = Math.max(0, this.rates[rarity] - reductionPerRarity);
            });
        }

        return adjustedRates;
    }

    /**
     * Update user's pity counter based on pull result
     * @param {string} userId - User ID
     * @param {string} rarity - Rarity of the pulled character
     */
    async updatePityCounter(userId, rarity) {
        try {
            const user = await this.userService.getUserById(userId);
            let newCounter = (user.pityCounter || 0) + 1;
            let lastHighRarityPull = user.lastHighRarityPull;

            // Reset pity counter if high-rarity character was pulled
            if (this.pityConfig.highRarityThreshold.includes(rarity)) {
                newCounter = 0;
                lastHighRarityPull = new Date();
            }

            await this.userService.updateUser(userId, {
                pityCounter: newCounter,
                lastHighRarityPull: lastHighRarityPull
            });
        } catch (error) {
            logger.error('Error updating pity counter:', error);
        }
    }

    /**
     * Calculate statistics from pull results
     * @param {Array} results - Pull results
     * @returns {Object} Statistics
     */
    calculatePullStats(results) {
        const stats = {
            total: results.length,
            newCharacters: 0,
            duplicates: 0,
            rarityBreakdown: {
                COMMON: 0,
                RARE: 0,
                EPIC: 0,
                LEGENDARY: 0,
                MYTHIC: 0,
                DIMENSIONAL: 0 // Include for stats even though not pullable
            }
        };

        results.forEach(result => {
            if (result.isNew) {
                stats.newCharacters++;
            } else {
                stats.duplicates++;
            }

            stats.rarityBreakdown[result.rarity]++;
        });

        return stats;
    }

    /**
     * Get gacha rates information
     * @returns {Object} Gacha rates and costs
     */
    getGachaInfo() {
        return {
            rates: this.rates,
            costs: this.costs,
            pitySystem: {
                description: 'Soft pity starts at 50 pulls, hard pity at 100 pulls. DIMENSIONAL characters are not available in regular pulls.',
                softPityStart: this.pityConfig.softPityStart,
                hardPity: this.pityConfig.hardPity,
                highRarityThreshold: this.pityConfig.highRarityThreshold,
                pityBonuses: this.pityConfig.pityBonus,
                dimensionalNote: 'DIMENSIONAL characters can only be obtained through dimensional events, raid boss drops, or limited banners.'
            }
        };
    }

    /**
     * Get user's pull history (recent pulls)
     * @param {string} userId - User ID
     * @param {number} limit - Number of recent pulls to fetch
     * @returns {Array} Recent pull history
     */
    async getPullHistory(userId, limit = 50) {
        if (!models) {
            return [];
        }

        try {
            const userCharacters = await models.UserCharacter.findAll({
                where: { userId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }],
                order: [['obtainedAt', 'DESC']],
                limit
            });

            return userCharacters.map(uc => ({
                character: uc.character,
                obtainedAt: uc.obtainedAt,
                rarity: uc.character.rarity
            }));

        } catch (error) {
            logger.error('Error in getPullHistory:', error);
            return [];
        }
    }
}

module.exports = GachaService;
