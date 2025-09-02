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
