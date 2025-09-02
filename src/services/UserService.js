const { User } = require('../database/models');
const logger = require('../utils/logger');

class UserService {
    async getOrCreateUser(userId, username) {
        if (!User) {
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
                createdAt: new Date()
            };
        }

        try {
            let user = await User.findByPk(userId);
            if (!user) {
                user = await User.create({
                    id: userId,
                    username: username
                });
                logger.info(`Created new user: ${username} (${userId})`);
            }
            return user;
        } catch (error) {
            logger.error('Error in getOrCreateUser:', error);
            throw error;
        }
    }

    async updateUser(userId, updates) {
        if (!User) {
            logger.warn('Database not available, cannot update user');
            return null;
        }

        try {
            const [affectedRows] = await User.update(updates, {
                where: { id: userId }
            });
            if (affectedRows === 0) {
                throw new Error('User not found');
            }
            return await User.findByPk(userId);
        } catch (error) {
            logger.error('Error in updateUser:', error);
            throw error;
        }
    }

    async getUserById(userId) {
        if (!User) {
            logger.warn('Database not available, cannot get user');
            return null;
        }

        try {
            return await User.findByPk(userId);
        } catch (error) {
            logger.error('Error in getUserById:', error);
            throw error;
        }
    }
}

module.exports = UserService;
