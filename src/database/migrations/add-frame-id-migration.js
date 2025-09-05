require('dotenv').config();
const { sequelize } = require('../connection');

async function addFrameIdField() {
    try {
        console.log('Adding frameId field to UserCharacters table...');

        await sequelize.getQueryInterface().addColumn('UserCharacters', 'frameId', {
            type: sequelize.Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
            comment: 'ID of the frame applied to this character card'
        });

        console.log('frameId field added successfully');
    } catch (error) {
        console.error('Failed to add frameId field:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    addFrameIdField().then(() => process.exit(0));
}

module.exports = addFrameIdField;
