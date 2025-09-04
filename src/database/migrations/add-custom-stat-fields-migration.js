require('dotenv').config();
const { sequelize } = require('../connection');

async function addCustomStatFields() {
    try {
        console.log('Adding custom stat fields to UserCharacters table...');

        await sequelize.getQueryInterface().addColumn('UserCharacters', 'customAttack', {
            type: sequelize.Sequelize.INTEGER,
            allowNull: true,
            comment: 'Custom attack stat after rarity upgrades'
        });

        await sequelize.getQueryInterface().addColumn('UserCharacters', 'customDefense', {
            type: sequelize.Sequelize.INTEGER,
            allowNull: true,
            comment: 'Custom defense stat after rarity upgrades'
        });

        await sequelize.getQueryInterface().addColumn('UserCharacters', 'customSpeed', {
            type: sequelize.Sequelize.INTEGER,
            allowNull: true,
            comment: 'Custom speed stat after rarity upgrades'
        });

        await sequelize.getQueryInterface().addColumn('UserCharacters', 'customHealth', {
            type: sequelize.Sequelize.INTEGER,
            allowNull: true,
            comment: 'Custom health stat after rarity upgrades'
        });

        console.log('Custom stat fields added successfully');
    } catch (error) {
        console.error('Failed to add custom stat fields:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addCustomStatFields().then(() => process.exit(0));
}

module.exports = addCustomStatFields;
