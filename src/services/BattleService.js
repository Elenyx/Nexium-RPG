/**
 * @file BattleService.js
 * @description Combat system for character battles
 * @author Nexium Bot Development Team
 */

const { models } = require('../database/connection');
const UserService = require('./UserService');
const logger = require('../utils/logger');

class BattleService {
    constructor() {
        this.userService = new UserService();
    }

    /**
     * Calculate battle damage
     * @param {Object} attacker - Attacking character stats
     * @param {Object} defender - Defending character stats
     * @returns {number} Damage dealt
     */
    calculateDamage(attacker, defender) {
        const baseDamage = attacker.attack;
        const defenseModifier = 1 - (defender.defense / (defender.defense + 100)); // Diminishing returns
        const speedModifier = 1 + (attacker.speed - defender.speed) / 200; // Speed advantage

        let damage = baseDamage * defenseModifier * speedModifier;

        // Random variance (±15%)
        const variance = 0.85 + (Math.random() * 0.3);
        damage *= variance;

        return Math.max(1, Math.floor(damage));
    }

    /**
     * Simulate a battle between two characters
     * @param {Object} char1 - First character
     * @param {Object} char2 - Second character
     * @returns {Object} Battle result
     */
    simulateBattle(char1, char2) {
        let hp1 = char1.health;
        let hp2 = char2.health;
        const turns = [];
        let turnCount = 0;
        const maxTurns = 50; // Prevent infinite battles

        while (hp1 > 0 && hp2 > 0 && turnCount < maxTurns) {
            turnCount++;

            // Character 1 attacks
            const damage1 = this.calculateDamage(char1, char2);
            hp2 -= damage1;

            turns.push({
                turn: turnCount,
                attacker: char1.name,
                defender: char2.name,
                damage: damage1,
                hpRemaining: Math.max(0, hp2)
            });

            if (hp2 <= 0) break;

            // Character 2 attacks
            const damage2 = this.calculateDamage(char2, char1);
            hp1 -= damage2;

            turns.push({
                turn: turnCount,
                attacker: char2.name,
                defender: char1.name,
                damage: damage2,
                hpRemaining: Math.max(0, hp1)
            });
        }

        const winner = hp1 > 0 ? char1 : hp2 > 0 ? char2 : null; // null for draw

        return {
            winner,
            turns,
            totalTurns: turnCount,
            finalHp: {
                [char1.name]: Math.max(0, hp1),
                [char2.name]: Math.max(0, hp2)
            },
            isDraw: winner === null
        };
    }

    /**
     * Start a battle between user's characters
     * @param {string} userId - User ID
     * @param {string} char1Id - First character ID
     * @param {string} char2Id - Second character ID
     * @returns {Object} Battle result with rewards
     */
    async startBattle(userId, char1Id, char2Id) {
        if (!models) {
            throw new Error('Database not available');
        }

        try {
            // Get user
            const user = await this.userService.getOrCreateUser(userId, 'Unknown');

            // Get user's characters
            const userCharacters = await this.userService.getUserCharacters(userId);
            const char1Data = userCharacters.find(uc => uc.character.id === char1Id);
            const char2Data = userCharacters.find(uc => uc.character.id === char2Id);

            if (!char1Data || !char2Data) {
                throw new Error('One or both characters not found in user collection');
            }

            // Apply custom levels to stats
            const char1 = this.applyCustomLevel(char1Data.character, char1Data.customLevel);
            const char2 = this.applyCustomLevel(char2Data.character, char2Data.customLevel);

            // Simulate battle
            const battleResult = this.simulateBattle(char1, char2);

            // Calculate rewards
            const rewards = this.calculateRewards(battleResult, user);

            // Apply rewards
            if (rewards.exp > 0) {
                const newExp = user.exp + rewards.exp;
                const newLevel = Math.floor(newExp / 1000) + 1;
                await this.userService.updateUser(userId, {
                    exp: newExp,
                    level: newLevel
                });
            }

            if (rewards.coins > 0) {
                await this.userService.updateUser(userId, {
                    coins: user.coins + rewards.coins
                });
            }

            return {
                battle: battleResult,
                rewards,
                participants: {
                    char1: {
                        ...char1,
                        customLevel: char1Data.customLevel
                    },
                    char2: {
                        ...char2,
                        customLevel: char2Data.customLevel
                    }
                }
            };

        } catch (error) {
            logger.error('Error in startBattle:', error);
            throw error;
        }
    }

    /**
     * Apply custom level bonuses to character stats
     * @param {Object} character - Base character
     * @param {number} customLevel - Custom level
     * @returns {Object} Character with level bonuses
     */
    applyCustomLevel(character, customLevel) {
        const levelBonus = customLevel - 1; // Level 1 = no bonus
        const statMultiplier = 1 + (levelBonus * 0.1); // 10% per level

        return {
            ...character.toJSON(),
            attack: Math.floor(character.attack * statMultiplier),
            defense: Math.floor(character.defense * statMultiplier),
            speed: Math.floor(character.speed * statMultiplier),
            health: Math.floor(character.health * statMultiplier)
        };
    }

    /**
     * Calculate battle rewards
     * @param {Object} battleResult - Battle simulation result
     * @param {Object} user - User data
     * @returns {Object} Rewards object
     */
    calculateRewards(battleResult, user) {
        let exp = 0;
        let coins = 0;

        if (!battleResult.isDraw) {
            // Base rewards
            exp = 50;
            coins = 25;

            // Bonus for winning
            if (battleResult.winner) {
                exp *= 1.5;
                coins *= 1.5;
            }

            // Level-based multiplier
            const levelMultiplier = 1 + (user.level * 0.05);
            exp = Math.floor(exp * levelMultiplier);
            coins = Math.floor(coins * levelMultiplier);

            // Turn efficiency bonus (fewer turns = more reward)
            const efficiencyBonus = Math.max(0.5, 2 - (battleResult.totalTurns / 20));
            exp = Math.floor(exp * efficiencyBonus);
            coins = Math.floor(coins * efficiencyBonus);
        }

        return {
            exp: Math.floor(exp),
            coins: Math.floor(coins),
            winner: battleResult.winner ? battleResult.winner.name : null
        };
    }

    /**
     * Get battle statistics for a user
     * @param {string} userId - User ID
     * @returns {Object} Battle statistics
     */
    async getBattleStats(userId) {
        // This would require a battles table to track battle history
        // For now, return placeholder stats
        return {
            totalBattles: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winRate: 0,
            totalExpGained: 0,
            totalCoinsGained: 0
        };
    }

    /**
     * Get available battle opponents for a user
     * @param {string} userId - User ID
     * @returns {Array} Available opponents
     */
    async getAvailableOpponents(userId) {
        if (!models) {
            return [];
        }

        try {
            const userCharacters = await this.userService.getUserCharacters(userId);

            if (userCharacters.length < 2) {
                return []; // Need at least 2 characters to battle
            }

            // Return all user's characters as potential opponents
            return userCharacters.map(uc => ({
                id: uc.character.id,
                name: uc.character.name,
                rarity: uc.character.rarity,
                level: uc.customLevel,
                attack: Math.floor(uc.character.attack * (1 + (uc.customLevel - 1) * 0.1)),
                defense: Math.floor(uc.character.defense * (1 + (uc.customLevel - 1) * 0.1)),
                speed: Math.floor(uc.character.speed * (1 + (uc.customLevel - 1) * 0.1)),
                health: Math.floor(uc.character.health * (1 + (uc.customLevel - 1) * 0.1))
            }));

        } catch (error) {
            logger.error('Error in getAvailableOpponents:', error);
            return [];
        }
    }
}

module.exports = BattleService;
