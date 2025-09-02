const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

let User = null;

if (sequelize) {
    User = sequelize.define('User', {
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
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
}

module.exports = User;
