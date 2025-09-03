require('dotenv').config();
const { sequelize } = require('../connection');

async function addPitySystemFields() {
    try {
        console.log('Adding pity system fields to Users table...');

        await sequelize.getQueryInterface().addColumn('Users', 'pityCounter', {
            type: sequelize.Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Number of pulls without getting a high-rarity character'
        });

        await sequelize.getQueryInterface().addColumn('Users', 'lastHighRarityPull', {
            type: sequelize.Sequelize.DATE,
            allowNull: true,
            comment: 'Timestamp of last high-rarity pull for pity calculation'
        });

        console.log('Pity system fields added successfully');
    } catch (error) {
        console.error('Failed to add pity system fields:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addPitySystemFields().then(() => process.exit(0));
}

module.exports = addPitySystemFields;
