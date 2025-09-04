require('dotenv').config();
const { sequelize } = require('../connection');

const runInitialMigrations = async () => {
    try {
        console.log('Running initial migrations...');

        // Migration for Users table
        await sequelize.getQueryInterface().createTable('Users', {
            id: {
                type: sequelize.Sequelize.STRING,
                primaryKey: true
            },
            username: {
                type: sequelize.Sequelize.STRING,
                allowNull: false
            },
            dimensionalEnergy: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 100
            },
            maxEnergy: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 100
            },
            coins: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 1000
            },
            exp: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 0
            },
            level: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 1
            },
            currentDimension: {
                type: sequelize.Sequelize.STRING,
                defaultValue: 'nexus_hub'
            },
            dailyStreak: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 0
            },
            lastDaily: {
                type: sequelize.Sequelize.DATE,
                allowNull: true
            },
            shards: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 0
            },
            createdAt: {
                type: sequelize.Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: sequelize.Sequelize.DATE,
                allowNull: false
            }
        });

        // Migration for Characters table
        await sequelize.getQueryInterface().createTable('Characters', {
            id: {
                type: sequelize.Sequelize.STRING,
                primaryKey: true
            },
            name: {
                type: sequelize.Sequelize.STRING,
                allowNull: false
            },
            anime: {
                type: sequelize.Sequelize.STRING,
                allowNull: false
            },
            rarity: {
                type: sequelize.Sequelize.ENUM('COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIMENSIONAL'),
                allowNull: false
            },
            level: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 1
            },
            exp: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 0
            },
            attack: {
                type: sequelize.Sequelize.INTEGER,
                allowNull: false
            },
            defense: {
                type: sequelize.Sequelize.INTEGER,
                allowNull: false
            },
            speed: {
                type: sequelize.Sequelize.INTEGER,
                allowNull: false
            },
            health: {
                type: sequelize.Sequelize.INTEGER,
                allowNull: false
            },
            abilities: {
                type: sequelize.Sequelize.JSON,
                defaultValue: []
            },
            description: {
                type: sequelize.Sequelize.TEXT,
                allowNull: false
            },
            imageUrl: {
                type: sequelize.Sequelize.STRING,
                allowNull: false
            },
            imageUrls: {
                type: sequelize.Sequelize.JSON,
                allowNull: true,
                defaultValue: {},
                comment: 'Rarity-specific image URLs: {COMMON: "url", RARE: "url", ...}'
            },
            imagePath: {
                type: sequelize.Sequelize.STRING,
                allowNull: true
            },
            isActive: {
                type: sequelize.Sequelize.BOOLEAN,
                defaultValue: true
            },
            createdAt: {
                type: sequelize.Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: sequelize.Sequelize.DATE,
                allowNull: false
            }
        });

        // Migration for UserCharacters junction table
        await sequelize.getQueryInterface().createTable('UserCharacters', {
            id: {
                type: sequelize.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: sequelize.Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            characterId: {
                type: sequelize.Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Characters',
                    key: 'id'
                }
            },
            quantity: {
                type: sequelize.Sequelize.INTEGER,
                defaultValue: 1
            },
            createdAt: {
                type: sequelize.Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: sequelize.Sequelize.DATE,
                allowNull: false
            }
        });

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

// Migration to add shards column to Users table
const addShardsToUsers = async () => {
    try {
        console.log('Adding shards column to Users table...');

        await sequelize.getQueryInterface().addColumn('Users', 'shards', {
            type: sequelize.Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });

        console.log('Shards column added successfully');
    } catch (error) {
        console.error('Failed to add shards column:', error);
        process.exit(1);
    }
};

// Migration to add imageUrls field to Characters table
const addImageUrlsToCharacters = async () => {
    try {
        console.log('Adding imageUrls field to Characters table...');

        await sequelize.getQueryInterface().addColumn('Characters', 'imageUrls', {
            type: sequelize.Sequelize.JSON,
            allowNull: true,
            defaultValue: {},
            comment: 'Rarity-specific image URLs: {COMMON: "url", RARE: "url", ...}'
        });

        console.log('imageUrls field added successfully');
    } catch (error) {
        console.error('Failed to add imageUrls field:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    require('dotenv').config();
    runInitialMigrations().then(() => process.exit(0));
}

module.exports = { runInitialMigrations, addShardsToUsers, addImageUrlsToCharacters };
