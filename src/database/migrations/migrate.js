require('dotenv').config();
const { sequelize } = require('../connection');

const runMigrations = async () => {
    try {
        console.log('Running migrations...');

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

if (require.main === module) {
    require('dotenv').config();
    runMigrations().then(() => process.exit(0));
}

module.exports = runMigrations;
