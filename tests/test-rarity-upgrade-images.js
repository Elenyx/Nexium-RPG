/**
 * Test script to validate rarity upgrade image URLs
 * @file test-rarity-upgrade-images.js
 */

const CharacterImageManager = require('../src/components/builders/CharacterImageManager');
const { models } = require('../src/database/connection');

async function testRarityUpgradeImages() {
    console.log('🖼️ Testing Rarity Upgrade Image System...\n');

    const imageManager = new CharacterImageManager();

    try {
        // Get a few test characters from database
        const characters = await models.Character.findAll({
            limit: 5,
            include: [{
                model: models.UserCharacter,
                as: 'userCharacters',
                required: false
            }]
        });

        console.log(`Found ${characters.length} characters to test:\n`);

        for (const character of characters) {
            console.log(`🎴 ${character.name} (${character.id})`);
            console.log(`   Current Rarity: ${character.rarity}`);
            console.log(`   Base Image URL: ${character.imageUrl}`);

            if (character.imageUrls && Object.keys(character.imageUrls).length > 0) {
                console.log(`   Rarity Images Available:`);
                for (const [rarity, url] of Object.entries(character.imageUrls)) {
                    console.log(`     ${rarity}: ${url}`);
                }

                // Test getting image for current rarity
                const currentImageUrl = imageManager.getCharacterImageUrlByRarity(character);
                console.log(`   Current Image URL: ${currentImageUrl}`);
            } else {
                console.log(`   ⚠️  No rarity-specific images configured`);
            }

            console.log('');
        }

        console.log('✅ Image URL validation completed!');

    } catch (error) {
        console.error('❌ Error testing rarity upgrade images:', error);
    }
}

async function testRarityUpgradeProcess() {
    console.log('\n🔄 Testing Rarity Upgrade Process...\n');

    try {
        // Get a character that has user ownership
        const userCharacter = await models.UserCharacter.findOne({
            include: [{
                model: models.Character,
                as: 'character'
            }],
            limit: 1
        });

        if (!userCharacter) {
            console.log('⚠️  No user characters found. Please add some characters first.');
            return;
        }

        const character = userCharacter.character;
        console.log(`Testing with: ${character.name} (${character.rarity})`);
        console.log(`Collected Shards: ${userCharacter.collectedShards}`);
        console.log(`Next Threshold: ${userCharacter.nextRarityThreshold}`);

        // Show current image
        const imageManager = new CharacterImageManager();
        const currentImageUrl = imageManager.getCharacterImageUrlByRarity(character);
        console.log(`Current Image: ${currentImageUrl}`);

        console.log('\n✅ Rarity upgrade process test completed!');

    } catch (error) {
        console.error('❌ Error testing rarity upgrade process:', error);
    }
}

// Run tests
if (require.main === module) {
    testRarityUpgradeImages()
        .then(() => testRarityUpgradeProcess())
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Test failed:', error);
            process.exit(1);
        });
}

module.exports = { testRarityUpgradeImages, testRarityUpgradeProcess };
