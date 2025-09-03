require('dotenv').config();
const { sequelize } = require('../connection');

async function addShardsToUsers() {
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
}

if (require.main === module) {
    addShardsToUsers().then(() => process.exit(0));
}

module.exports = addShardsToUsers;
