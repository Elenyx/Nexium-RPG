const { DataTypes } = require('sequelize');

const defineUser = (sequelize) => {
    if (!sequelize) return null;

    return sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dimensionalEnergy: {
            type: DataTypes.INTEGER,
            defaultValue: 100
        },
        maxEnergy: {
            type: DataTypes.INTEGER,
            defaultValue: 100
        },
        coins: {
            type: DataTypes.INTEGER,
            defaultValue: 1000
        },
        exp: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        currentDimension: {
            type: DataTypes.STRING,
            defaultValue: 'nexus_hub'
        },
        dailyStreak: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lastDaily: {
            type: DataTypes.DATE,
            allowNull: true
        },
        shards: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        // Premium currency (gems) for purchases, cosmetics, etc.
        gems: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        pityCounter: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Number of pulls without getting a high-rarity character'
        },
        lastHighRarityPull: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp of last high-rarity pull for pity calculation'
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

module.exports = defineUser;
