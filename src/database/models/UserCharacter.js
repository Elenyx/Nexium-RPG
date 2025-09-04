const { DataTypes } = require('sequelize');

const defineUserCharacter = (sequelize) => {
    if (!sequelize) return null;

    return sequelize.define('UserCharacter', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        characterId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Characters',
                key: 'id'
            }
        },
        obtainedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        isFavorite: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        customLevel: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        customExp: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        collectedShards: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Shards collected for rarity upgrade'
        },
        nextRarityThreshold: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: 'Shard threshold needed for next rarity upgrade'
        },
        // Custom base stats for rarity upgrades (null means use original character stats)
        customAttack: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Custom attack stat after rarity upgrades'
        },
        customDefense: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Custom defense stat after rarity upgrades'
        },
        customSpeed: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Custom speed stat after rarity upgrades'
        },
        customHealth: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Custom health stat after rarity upgrades'
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'characterId']
            }
        ]
    });
};

module.exports = defineUserCharacter;
