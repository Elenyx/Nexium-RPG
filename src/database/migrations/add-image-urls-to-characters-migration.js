require('dotenv').config();
const { sequelize } = require('../connection');

async function addImageUrlsToCharacters() {
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
}

if (require.main === module) {
    addImageUrlsToCharacters().then(() => process.exit(0));
}

module.exports = addImageUrlsToCharacters;
