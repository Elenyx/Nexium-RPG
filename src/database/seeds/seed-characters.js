/**
 * @file src/database/seeds/seed-characters.js
 * @description Seeds the Character table with sample character data
 */

const sampleCharacters = require('../../assets/sample/SampleCharacters');
const { Character } = require('../models');

const seedCharacters = async () => {
    try {
        console.log('🌱 Seeding characters...');

        for (const charData of sampleCharacters) {
            const [character, created] = await Character.findOrCreate({
                where: { id: charData.id },
                defaults: {
                    id: charData.id,
                    name: charData.name,
                    anime: charData.anime,
                    rarity: charData.rarity,
                    level: charData.level,
                    exp: charData.exp,
                    attack: charData.attack,
                    defense: charData.defense,
                    speed: charData.speed,
                    health: charData.health,
                    abilities: charData.abilities,
                    description: charData.description,
                    imageUrl: charData.imageUrl,
                    imagePath: charData.imagePath
                }
            });

            if (created) {
                console.log(`✅ Created character: ${character.name}`);
            } else {
                console.log(`⏭️  Character already exists: ${character.name}`);
            }
        }

        console.log('🎉 Character seeding completed!');
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
