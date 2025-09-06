/**
 * @file src/database/seeds/seed-frames.js
 * @description Seeds the UserProfile table with frame data for existing users
 */

require('dotenv').config();
const { models } = require('../connection');
const { frames } = require('../../config/frames');

const seedFrames = async () => {
    try {
        console.log('🌱 Seeding user frames...');

        // Get all existing users
        const users = await models.User.findAll({
            attributes: ['id', 'username']
        });

        if (users.length === 0) {
            console.log('⚠️  No users found. Skipping frame seeding.');
            return;
        }

        console.log(`📊 Found ${users.length} users to seed frames for`);

        // Default frames that all users should have unlocked
        const defaultFrames = [
            'default',
            'common',
            'rare',
            'epic',
            'legendary',
            'mythic',
            'dimensional'
        ];

        // Shop frames that some users might have purchased
        const shopFrames = [
            'shop_fire',
            'shop_ice',
            'shop_nature',
            'shop_arcane',
            'shop_futuristic',
            'shop_ancient_ruins',
            'premium_celestial',
            'premium_shadow',
            'premium_mechanical',
            'premium_oceanic'
        ];

        let seededCount = 0;
        let updatedCount = 0;

        for (const user of users) {
            // Check if user already has a profile
            let userProfile = await models.UserProfile.findOne({
                where: { userId: user.id }
            });

            let unlockedFrames = [...defaultFrames]; // Start with default frames

            if (userProfile) {
                // User already has a profile, merge existing frames
                const existingFrames = userProfile.unlockedFrames || [];
                unlockedFrames = [...new Set([...existingFrames, ...defaultFrames])];
                console.log(`⏭️  Updating frames for user: ${user.username}`);
                updatedCount++;
            } else {
                // New profile, randomly assign some shop frames
                const randomShopFrames = shopFrames
                    .filter(() => Math.random() > 0.7) // 30% chance for each shop frame
                    .slice(0, Math.floor(Math.random() * 4) + 1); // 1-4 random shop frames

                unlockedFrames = [...defaultFrames, ...randomShopFrames];
                console.log(`✅ Creating profile for user: ${user.username} with ${unlockedFrames.length} frames`);
                seededCount++;
            }

            // Upsert the user profile
            await models.UserProfile.upsert({
                userId: user.id,
                unlockedFrames: unlockedFrames
            });
        }

        console.log(`🎉 Frame seeding completed!`);
        console.log(`   📈 New profiles created: ${seededCount}`);
        console.log(`   🔄 Existing profiles updated: ${updatedCount}`);
        console.log(`   🎨 Total frames distributed across all users`);

    } catch (error) {
        console.error('❌ Error seeding frames:', error);
        throw error;
    }
};

module.exports = seedFrames;

// Run if called directly
if (require.main === module) {
    const { Sequelize } = require('sequelize');

    const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://localhost:5432/nexium_rpg', {
        logging: false
    });

    const models = require('../models')(sequelize);

    sequelize.sync()
        .then(() => seedFrames())
        .then(() => {
            console.log('✅ Frame seeding completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Frame seeding failed:', error);
            process.exit(1);
        });
}
