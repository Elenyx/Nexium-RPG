/**
 * Test script for CharacterImageManager with rarity frames
 * @file test-rarity-frames.js
 * @description Tests the rarity frame overlay functionality
 */

const CharacterImageManager = require('../src/components/builders/CharacterImageManager');

async function testRarityFrames() {
    console.log('🖼️ Testing Character Image Manager with Rarity Frames...\n');

    const imageManager = new CharacterImageManager();

    // Test character data
    const testCharacters = [
        {
            id: 'char_001',
            name: 'Naruto Uzumaki',
            rarity: 'COMMON',
            imageUrl: 'https://ik.imagekit.io/nexiumrpg/naruto.jpg'
        },
        {
            id: 'char_002',
            name: 'Sasuke Uchiha',
            rarity: 'RARE',
            imageUrl: 'https://ik.imagekit.io/nexiumrpg/sasuke.png'
        },
        {
            id: 'char_003',
            name: 'Monkey D. Luffy',
            rarity: 'EPIC',
            imageUrl: 'https://ik.imagekit.io/nexiumrpg/luffy.png'
        },
        {
            id: 'char_004',
            name: 'Edward Elric',
            rarity: 'LEGENDARY',
            imageUrl: 'https://ik.imagekit.io/nexiumrpg/edward.png'
        },
        {
            id: 'char_005',
            name: 'Son Goku',
            rarity: 'MYTHIC',
            imageUrl: 'https://ik.imagekit.io/nexiumrpg/goku.png'
        },
        {
            id: 'char_006',
            name: 'Light Yagami',
            rarity: 'DIMENSIONAL',
            imageUrl: 'https://ik.imagekit.io/nexiumrpg/light.png'
        }
    ];

    console.log('🧪 Testing Rarity Frame URL Generation...\n');

    for (const character of testCharacters) {
        console.log(`🎴 Testing ${character.name} (${character.rarity})...`);

        // Test frame overlay URL generation
        const framedUrl = imageManager.getCharacterImageWithFrame(character.imageUrl, character.rarity);
        console.log(`   Original: ${character.imageUrl}`);
        console.log(`   With Frame: ${framedUrl}`);

        // Test loading character image with frame
        const imageResult = await imageManager.loadCharacterImage(character);
        console.log(`   Load Result: ${imageResult.success ? '✅ Success' : '❌ Failed'}`);
        if (imageResult.success) {
            console.log(`   Final URL: ${imageResult.url}`);
        }

        console.log('');
    }

    console.log('🎯 Testing Character Preparation with Frames...\n');

    // Test prepareCharacterWithImage
    const preparedCharacters = imageManager.prepareCharactersWithImages(testCharacters);

    for (const char of preparedCharacters) {
        console.log(`📋 ${char.name}:`);
        console.log(`   Display Image: ${char.displayImage}`);
        console.log(`   Has Frame: ${char.displayImage.includes('tr=l-') ? '✅ Yes' : '❌ No'}`);
        console.log('');
    }

    console.log('✅ Rarity Frame Testing Complete!');
}

async function testInvalidInputs() {
    console.log('🚫 Testing Invalid Inputs...\n');

    const imageManager = new CharacterImageManager();

    // Test with invalid rarity
    const invalidRarityUrl = imageManager.getCharacterImageWithFrame(
        'https://ik.imagekit.io/nexiumrpg/test.jpg',
        'INVALID_RARITY'
    );
    console.log(`Invalid Rarity: ${invalidRarityUrl}`);
    console.log(`Unchanged: ${invalidRarityUrl === 'https://ik.imagekit.io/nexiumrpg/test.jpg' ? '✅ Yes' : '❌ No'}`);

    // Test with null/empty inputs
    const nullUrl = imageManager.getCharacterImageWithFrame(null, 'COMMON');
    console.log(`Null URL: ${nullUrl}`);
    console.log(`Unchanged: ${nullUrl === null ? '✅ Yes' : '❌ No'}`);

    console.log('\n✅ Invalid Input Testing Complete!');
}

// Run tests
async function runAllTests() {
    try {
        await testRarityFrames();
        console.log('\n' + '='.repeat(50) + '\n');
        await testInvalidInputs();
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

if (require.main === module) {
    runAllTests();
}

module.exports = { testRarityFrames, testInvalidInputs };
