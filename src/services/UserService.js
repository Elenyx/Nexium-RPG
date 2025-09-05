const { models } = require('../database/connection');
const { RARITY_UPGRADE_THRESHOLDS } = require('../config/constants');
const logger = require('../utils/logger');
const InventoryService = require('./InventoryService');

class UserService {
    async getOrCreateUser(userId, username) {
        if (!models) {
            // Return a mock user object if no database
            return {
                id: userId,
                username: username,
                dimensionalEnergy: 100,
                maxEnergy: 100,
                coins: 1000,
                exp: 0,
                level: 1,
                currentDimension: 'nexus_hub',
                dailyStreak: 0,
                lastDaily: null,
                shards: 0,
                collectionCount: 0,
                createdAt: new Date()
            };
        }

        try {
            let user = await models.User.findByPk(userId);
            if (!user) {
                user = await models.User.create({
                    id: userId,
                    username: username
                });
                logger.info(`Created new user: ${username} (${userId})`);
                
                // Return user with collection count for new users
                // Create inventory for new user
                const invService = new InventoryService();
                const inventory = await invService.getOrCreateInventory(userId);

                return {
                    ...user.toJSON(),
                    collectionCount: 0,
                    inventory: inventory.data || {}
                };
            }
            
            // Get collection count
            const collectionCount = await models.UserCharacter.count({
                where: { userId: userId }
            });
            
            // Append inventory data
            const invService = new InventoryService();
            const inventory = await invService.getOrCreateInventory(userId);

            return {
                ...user.toJSON(),
                collectionCount: collectionCount,
                inventory: inventory.data || {}
            };
        } catch (error) {
            logger.error('Error in getOrCreateUser:', error);
            throw error;
        }
    }

    async updateUser(userId, updates) {
        if (!models) {
            logger.warn('Database not available, cannot update user');
            return null;
        }

        try {
            const [affectedRows] = await models.User.update(updates, {
                where: { id: userId }
            });
            if (affectedRows === 0) {
                throw new Error('User not found');
            }
            return await models.User.findByPk(userId);
        } catch (error) {
            logger.error('Error in updateUser:', error);
            throw error;
        }
    }

    async getUserById(userId) {
        if (!models) {
            logger.warn('Database not available, cannot get user');
            return null;
        }

        try {
            return await models.User.findByPk(userId);
        } catch (error) {
            logger.error('Error in getUserById:', error);
            throw error;
        }
    }

    async addCharacterToUser(userId, characterId, options = {}) {
        if (!models) {
            logger.warn('Database not available, cannot add character to user');
            return null;
        }

        try {
            // Get character info to determine rarity threshold
            const character = await models.Character.findByPk(characterId);
            const nextRarityThreshold = character ? RARITY_UPGRADE_THRESHOLDS[character.rarity] || 0 : 0;

            const [userCharacter, created] = await models.UserCharacter.findOrCreate({
                where: {
                    userId: userId,
                    characterId: characterId
                },
                defaults: {
                    userId: userId,
                    characterId: characterId,
                    obtainedAt: new Date(),
                    isFavorite: options.isFavorite || false,
                    customLevel: options.customLevel || 1,
                    customExp: options.customExp || 0,
                    collectedShards: 0,
                    nextRarityThreshold: nextRarityThreshold
                }
            });

            if (created) {
                logger.info(`Added character ${characterId} to user ${userId}`);
            } else {
                logger.info(`User ${userId} already owns character ${characterId}`);
            }

            return {
                ...userCharacter.toJSON(),
                isNewlyCreated: created
            };
        } catch (error) {
            logger.error('Error in addCharacterToUser:', error);
            throw error;
        }
    }

    async getUserCharacters(userId, options = {}) {
        if (!models) {
            logger.warn('Database not available, cannot get user characters');
            return [];
        }

        try {
            const userCharacters = await models.UserCharacter.findAll({
                where: { userId: userId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }],
                order: options.order || [['obtainedAt', 'DESC']]
            });

            return userCharacters;
        } catch (error) {
            logger.error('Error in getUserCharacters:', error);
            throw error;
        }
    }

    async removeCharacterFromUser(userId, characterId) {
        if (!models) {
            logger.warn('Database not available, cannot remove character from user');
            return false;
        }

        try {
            const deleted = await models.UserCharacter.destroy({
                where: {
                    userId: userId,
                    characterId: characterId
                }
            });

            if (deleted > 0) {
                logger.info(`Removed character ${characterId} from user ${userId}`);
            }

            return deleted > 0;
        } catch (error) {
            logger.error('Error in removeCharacterFromUser:', error);
            throw error;
        }
    }
}

module.exports = UserService;
