require('dotenv').config();
const { models } = require('../connection');
const seedCharacters = require('./seed-characters');
const seedFrames = require('./seed-frames');

const runSeeds = async () => {
    try {
        console.log('🚀 Running all seeds...');

        // Seed characters first
        await seedCharacters();

        // Seed frames for existing users
        await seedFrames();

        // Example seed data - you can customize this
        const sampleUsers = [
            {
                id: '123456789012345678', // Discord user ID
                username: 'TestUser',
                dimensionalEnergy: 100,
                maxEnergy: 100,
                coins: 1000,
                exp: 0,
                level: 1,
                currentDimension: 'nexus_hub',
                dailyStreak: 0,
                lastDaily: null
            }
        ];

        for (const userData of sampleUsers) {
            await models.User.upsert(userData);
        }

        console.log('✅ All seeding completed successfully');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    require('dotenv').config();
    runSeeds().then(() => process.exit(0));
}

module.exports = runSeeds;
