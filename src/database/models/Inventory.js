const { DataTypes } = require('sequelize');

const defineInventory = (sequelize) => {
    if (!sequelize) return null;

    return sequelize.define('Inventory', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // JSON blob to store flexible inventory structure: shards list, items, accessories, frames, etc.
        data: {
            type: DataTypes.JSONB,
            defaultValue: {}
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
};

module.exports = defineInventory;
