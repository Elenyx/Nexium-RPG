/**
 * Test script for CharacterImageManager with complete character cards
 * @file test-character-cards.js
 * @description Tests the character image handling with complete card designs
 */

const CharacterImageManager = require('../src/components/builders/CharacterImageManager');
const path = require('path');
const fs = require('fs');

async function testCharacterCards() {
    console.log('🖼️ Testing Character Image Manager with Character Cards...\n');

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
            rarity: 'DIMENSIONAL', // Note: DIMENSIONAL characters are event-only, not available in regular pulls
            imageUrl: 'https://ik.imagekit.io/nexiumrpg/light.png'
        }
    ];

    console.log('🧪 Testing Character Image Loading...\n');

    for (const character of testCharacters) {
        console.log(`🎴 Testing ${character.name} (${character.rarity})...`);

        // Test loading character image (complete card design)
        const imageResult = await imageManager.loadCharacterImage(character);
        console.log(`   Load Result: ${imageResult.success ? '✅ Success' : '❌ Failed'}`);
        if (imageResult.success) {
            console.log(`   Final URL: ${imageResult.url}`);
            console.log(`   Source: ${imageResult.source}`);
        }

        console.log('');
    }

    console.log('🎯 Testing Character Preparation...\n');

    // Test prepareCharacterWithImage
    const preparedCharacters = imageManager.prepareCharactersWithImages(testCharacters);

    for (const char of preparedCharacters) {
        console.log(`📋 ${char.name}:`);
        console.log(`   Display Image: ${char.displayImage}`);
        console.log('');
    }

    console.log('✅ Character Card Testing Complete!');
}

async function testInvalidInputs() {
    console.log('🚫 Testing Invalid Inputs...\n');

    const imageManager = new CharacterImageManager();

    // Test with null/empty inputs
    try {
        const nullCharacter = await imageManager.loadCharacterImage(null);
        console.log(`Null character: ${nullCharacter.success ? '✅ Unexpected success' : '❌ Failed as expected'}`);
    } catch (error) {
        console.log(`Null character: ❌ Failed with error: ${error.message}`);
    }

    try {
        const emptyCharacter = await imageManager.loadCharacterImage({});
        console.log(`Empty character: ${emptyCharacter.success ? '✅ Unexpected success' : '❌ Failed as expected'}`);
    } catch (error) {
        console.log(`Empty character: ❌ Failed with error: ${error.message}`);
    }

    console.log('\n✅ Invalid Input Testing Complete!');
}

// Run tests
async function runAllTests() {
    try {
        await testCharacterCards();
        console.log('\n' + '='.repeat(50) + '\n');
        await testInvalidInputs();
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

if (require.main === module) {
    runAllTests();
}

module.exports = { testCharacterCards, testInvalidInputs };
