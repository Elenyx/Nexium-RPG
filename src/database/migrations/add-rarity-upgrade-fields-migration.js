require('dotenv').config();
const { sequelize } = require('../connection');

async function addRarityUpgradeFields() {
    try {
        console.log('Adding rarity upgrade fields to UserCharacters table...');

        await sequelize.getQueryInterface().addColumn('UserCharacters', 'collectedShards', {
            type: sequelize.Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Shards collected for rarity upgrade'
        });

        await sequelize.getQueryInterface().addColumn('UserCharacters', 'nextRarityThreshold', {
            type: sequelize.Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Shard threshold needed for next rarity upgrade'
        });

        console.log('Rarity upgrade fields added successfully');
    } catch (error) {
        console.error('Failed to add rarity upgrade fields:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addRarityUpgradeFields().then(() => process.exit(0));
}

module.exports = addRarityUpgradeFields;
