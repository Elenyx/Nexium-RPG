require('dotenv').config();
const { sequelize } = require('../connection');

async function addGemsAndInventory() {
    try {
        console.log('Adding gems column to Users table...');

        await sequelize.getQueryInterface().addColumn('Users', 'gems', {
            type: sequelize.Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });

        console.log('Creating Inventories table...');

        await sequelize.getQueryInterface().createTable('Inventories', {
            id: {
                type: sequelize.Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: sequelize.Sequelize.STRING,
                allowNull: false
            },
            data: {
                type: 'JSONB',
                defaultValue: {}
            },
            createdAt: {
                type: sequelize.Sequelize.DATE,
                defaultValue: sequelize.Sequelize.NOW
            },
            updatedAt: {
                type: sequelize.Sequelize.DATE,
                defaultValue: sequelize.Sequelize.NOW
            }
        });

        console.log('Migration finished successfully');
    } catch (error) {
        console.error('Failed to run migration:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addGemsAndInventory().then(() => process.exit(0));
}

module.exports = addGemsAndInventory;
