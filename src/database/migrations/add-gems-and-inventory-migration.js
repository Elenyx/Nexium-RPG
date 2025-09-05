require('dotenv').config();
const { sequelize } = require('../connection');

async function addGemsAndInventory() {
    try {
    console.log('Adding gems column to Users table (if not exists)...');

    // Use raw query with IF NOT EXISTS to make this migration idempotent
    await sequelize.query(`ALTER TABLE "public"."Users" ADD COLUMN IF NOT EXISTS "gems" INTEGER NOT NULL DEFAULT 0;`);

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
                type: sequelize.Sequelize.JSON,
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
