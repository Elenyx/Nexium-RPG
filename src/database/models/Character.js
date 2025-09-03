const { DataTypes } = require('sequelize');

const defineCharacter = (sequelize) => {
    if (!sequelize) return null;

    return sequelize.define('Character', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        anime: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rarity: {
            type: DataTypes.ENUM('COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIMENSIONAL'),
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        exp: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        attack: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defense: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        speed: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        health: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        abilities: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageUrls: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {},
            comment: 'Rarity-specific image URLs: {COMMON: "url", RARE: "url", ...}'
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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

module.exports = defineCharacter;
