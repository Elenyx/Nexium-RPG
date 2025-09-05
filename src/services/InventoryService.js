const { models } = require('../database/connection');
const logger = require('../utils/logger');

class InventoryService {
    async getOrCreateInventory(userId) {
        if (!models) {
            return { userId, data: {} };
        }

        try {
            // First, ensure the user exists
            let user = await models.User.findByPk(userId);
            if (!user) {
                // Create the user if they don't exist
                user = await models.User.create({
                    id: userId,
                    username: `User_${userId}`, // Default username
                });
                logger.info(`Created user for inventory: ${userId}`);
            }

            let inventory = await models.Inventory.findOne({ where: { userId } });
            if (!inventory) {
                inventory = await models.Inventory.create({ userId, data: {} });
                logger.info(`Created inventory for user ${userId}`);
            }
            return inventory.toJSON ? inventory.toJSON() : inventory;
        } catch (error) {
            logger.error('Error in getOrCreateInventory:', error);
            throw error;
        }
    }

    async updateInventory(userId, updates) {
        if (!models) {
            logger.warn('Database not available, cannot update inventory');
            return null;
        }

        try {
            const [affected] = await models.Inventory.update(updates, { where: { userId } });
            if (affected === 0) {
                throw new Error('Inventory not found');
            }
            return await models.Inventory.findOne({ where: { userId } });
        } catch (error) {
            logger.error('Error in updateInventory:', error);
            throw error;
        }
    }

    // Convenience methods for common operations
    async addGems(userId, amount) {
        if (!models) return null;
        try {
            const user = await models.User.findByPk(userId);
            if (!user) throw new Error('User not found');
            user.gems = (user.gems || 0) + amount;
            await user.save();
            return user;
        } catch (error) {
            logger.error('Error in addGems:', error);
            throw error;
        }
    }

    async removeGems(userId, amount) {
        if (!models) return null;
        try {
            const user = await models.User.findByPk(userId);
            if (!user) throw new Error('User not found');
            user.gems = Math.max(0, (user.gems || 0) - amount);
            await user.save();
            return user;
        } catch (error) {
            logger.error('Error in removeGems:', error);
            throw error;
        }
    }

    // Inventory item operations (data is stored as JSONB in Inventory.data)
    async addItem(userId, item) {
        if (!models) return null;
        try {
            const inv = await this.getOrCreateInventory(userId);
            const data = inv.data || {};
            data.items = data.items || [];

            // Merge stackable items by id
            const existing = data.items.find(i => i.id === item.id);
            if (existing && item.qty) {
                existing.qty = (existing.qty || 0) + item.qty;
            } else if (existing) {
                // If no qty provided, increment by 1
                existing.qty = (existing.qty || 0) + 1;
            } else {
                data.items.push(Object.assign({ qty: item.qty || 1 }, item));
            }

            await models.Inventory.update({ data }, { where: { userId } });
            return data;
        } catch (error) {
            logger.error('Error in addItem:', error);
            throw error;
        }
    }

    async removeItem(userId, itemId, qty = 1) {
        if (!models) return null;
        try {
            const inv = await this.getOrCreateInventory(userId);
            const data = inv.data || {};
            data.items = data.items || [];

            const idx = data.items.findIndex(i => i.id === itemId);
            if (idx === -1) return false;

            const item = data.items[idx];
            if ((item.qty || 1) > qty) {
                item.qty -= qty;
            } else {
                data.items.splice(idx, 1);
            }

            await models.Inventory.update({ data }, { where: { userId } });
            return true;
        } catch (error) {
            logger.error('Error in removeItem:', error);
            throw error;
        }
    }

    async listItems(userId, category = null) {
        if (!models) return [];
        try {
            const inv = await this.getOrCreateInventory(userId);
            const data = inv.data || {};
            const items = data.items || [];
            if (!category) return items;
            return items.filter(i => i.category === category);
        } catch (error) {
            logger.error('Error in listItems:', error);
            throw error;
        }
    }

    async equipAccessory(userId, accessoryId) {
        if (!models) return null;
        try {
            const inv = await this.getOrCreateInventory(userId);
            const data = inv.data || {};
            data.accessories = data.accessories || [];
            const accessory = data.accessories.find(a => a.id === accessoryId);
            if (!accessory) throw new Error('Accessory not found');

            // Mark accessory as equipped and unequip others in same slot
            const slot = accessory.slot || 'main';
            data.accessories.forEach(a => {
                if (a.slot === slot) a.equipped = false;
            });
            accessory.equipped = true;

            await models.Inventory.update({ data }, { where: { userId } });
            return accessory;
        } catch (error) {
            logger.error('Error in equipAccessory:', error);
            throw error;
        }
    }
}

module.exports = InventoryService;
