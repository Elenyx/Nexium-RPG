const { DataTypes } = require('sequelize');

const defineUserProfile = (sequelize) => {
    if (!sequelize) return null;

    return sequelize.define('UserProfile', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        unlockedFrames: {
            type: DataTypes.JSON,
            defaultValue: [],
            comment: 'Array of unlocked frame IDs'
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

module.exports = defineUserProfile;
