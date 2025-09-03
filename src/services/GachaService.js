/**
 * @file GachaService.js
 * @description Advanced gacha system with rarity mechanics and improved pull systems
 * @author Nexium Bot Development Team
 */

const { models } = require('../database/connection');
const UserService = require('./UserService');
const logger = require('../utils/logger');

class GachaService {
    constructor() {
        this.userService = new UserService();

        // Gacha rates (in percentage)
        this.rates = {
            COMMON: 60.0,
            RARE: 25.0,
            EPIC: 10.0,
            LEGENDARY: 4.0,
            MYTHIC: 0.9,
            DIMENSIONAL: 0.1
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

            // Get all available characters
            const characters = await models.Character.findAll();
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
        // Generate random number for rarity determination
        const random = Math.random() * 100;
        let cumulativeRate = 0;
        let selectedRarity = 'COMMON';

        // Determine rarity based on rates
        for (const [rarity, rate] of Object.entries(this.rates)) {
            cumulativeRate += rate;
            if (random <= cumulativeRate) {
                selectedRarity = rarity;
                break;
            }
        }

        // Filter characters by selected rarity
        const rarityCharacters = characters.filter(char => char.rarity === selectedRarity);

        if (rarityCharacters.length === 0) {
            // Fallback to any character if no characters of selected rarity
            const fallbackChar = characters[Math.floor(Math.random() * characters.length)];
            const result = await this.userService.addCharacterToUser(userId, fallbackChar.id);
            return {
                character: fallbackChar,
                rarity: fallbackChar.rarity,
                isNew: result.isNewlyCreated
            };
        }

        // Select random character from the rarity pool
        const selectedCharacter = rarityCharacters[Math.floor(Math.random() * rarityCharacters.length)];
        const result = await this.userService.addCharacterToUser(userId, selectedCharacter.id);

        return {
            character: selectedCharacter,
            rarity: selectedRarity,
            isNew: result.isNewlyCreated
        };
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
                DIMENSIONAL: 0
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
                description: 'No pity system currently implemented',
                note: 'All pulls have the same rates'
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
