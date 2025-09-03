/**
 * @file src/database/seeds/seed-characters.js
 * @description Seeds the Character table with character data from the new organized structure
 */

require('dotenv').config();
const characters = require('../../assets/characters');
const { models } = require('../connection');

const seedCharacters = async () => {
    try {
        console.log('🌱 Seeding characters...');

        for (const charData of characters.all) {
            const [character, created] = await models.Character.findOrCreate({
                where: { id: charData.id },
                defaults: {
                    id: charData.id,
                    name: charData.name,
                    anime: charData.anime,
                    rarity: charData.rarity,
                    level: charData.baseStats.level,
                    exp: charData.baseStats.exp,
                    attack: charData.baseStats.attack,
                    defense: charData.baseStats.defense,
                    speed: charData.baseStats.speed,
                    health: charData.baseStats.health,
                    abilities: charData.abilities,
                    description: charData.description,
                    imageUrl: charData.imageUrl,
                    imageUrls: charData.imageUrls || {},
                    thumbnailUrl: charData.thumbnailUrl,
                    element: charData.element,
                    class: charData.class,
                    region: charData.region,
                    quote: charData.quote
                }
            });

            if (created) {
                console.log(`✅ Created character: ${character.name} (${character.rarity})`);
            } else {
                console.log(`⏭️  Character already exists: ${character.name}`);
            }
        }

        console.log(`🎉 Character seeding completed! Total: ${characters.all.length} characters`);
    } catch (error) {
        console.error('❌ Error seeding characters:', error);
        throw error;
    }
};

module.exports = seedCharacters;

// Run if called directly
if (require.main === module) {
    const { Sequelize } = require('sequelize');
    require('dotenv').config();

    const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/nexium_rpg', {
        logging: false
    });

    const models = require('../models')(sequelize);

    sequelize.sync()
        .then(() => seedCharacters())
        .then(() => {
            console.log('✅ Seeding completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}
