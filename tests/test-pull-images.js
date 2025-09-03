/**
 * Test script for PullImageGenerator
 * @file test-pull-images.js
 * @description Tests the Canvas-based pull result image generation
 */

const PullImageGenerator = require('../src/services/PullImageGenerator');
const fs = require('fs');
const path = require('path');

// Sample character data for testing
const sampleCharacters = [
    {
        id: 'char_001',
        name: 'Naruto Uzumaki',
        anime: 'Naruto',
        rarity: 'COMMON',
        imageUrl: 'https://ik.imagekit.io/nexiumrpg/naruto.jpg'
    },
    {
        id: 'char_002',
        name: 'Sasuke Uchiha',
        anime: 'Naruto',
        rarity: 'RARE',
        imageUrl: 'https://ik.imagekit.io/nexiumrpg/sasuke.png'
    },
    {
        id: 'char_003',
        name: 'Monkey D. Luffy',
        anime: 'One Piece',
        rarity: 'EPIC',
        imageUrl: 'https://ik.imagekit.io/nexiumrpg/luffy.png'
    },
    {
        id: 'char_004',
        name: 'Edward Elric',
        anime: 'Fullmetal Alchemist',
        rarity: 'LEGENDARY',
        imageUrl: 'https://ik.imagekit.io/nexiumrpg/edward.png'
    },
    {
        id: 'char_005',
        name: 'Son Goku',
        anime: 'Dragon Ball',
        rarity: 'MYTHIC',
        imageUrl: 'https://ik.imagekit.io/nexiumrpg/goku.png'
    },
    {
        id: 'char_006',
        name: 'Light Yagami',
        anime: 'Death Note',
        rarity: 'DIMENSIONAL', // Note: DIMENSIONAL characters are event-only, not available in regular pulls
        imageUrl: 'https://ik.imagekit.io/nexiumrpg/light.png'
    }
];

async function testSingleCharacterCard() {
    console.log('🖼️ Testing Single Character Card Generation...\n');

    const generator = new PullImageGenerator();

    try {
        const character = sampleCharacters[0]; // Naruto
        console.log(`Generating card for: ${character.name} (${character.rarity})`);

        const imageBuffer = await generator.generateCharacterCard(character);

        // Save to file for verification
        const outputPath = path.join(__dirname, '..', 'tests', 'test-card.png');
        fs.writeFileSync(outputPath, imageBuffer);

        console.log(`✅ Card generated successfully: ${outputPath}`);
        console.log(`   File size: ${imageBuffer.length} bytes`);

    } catch (error) {
        console.error('❌ Single card generation failed:', error.message);
    }
}

async function testMultiCharacterPull() {
    console.log('\n🎯 Testing Multi-Character Pull Results...\n');

    const generator = new PullImageGenerator();

    try {
        // Test with 3 characters
        const testCharacters = sampleCharacters.slice(0, 3);
        console.log(`Generating pull results for ${testCharacters.length} characters:`);
        testCharacters.forEach(char => console.log(`   - ${char.name} (${char.rarity})`));

        const imageBuffer = await generator.generatePullResultsImage(testCharacters);

        // Save to file for verification
        const outputPath = path.join(__dirname, '..', 'tests', 'test-pull-results.png');
        fs.writeFileSync(outputPath, imageBuffer);

        console.log(`✅ Pull results generated successfully: ${outputPath}`);
        console.log(`   File size: ${imageBuffer.length} bytes`);

    } catch (error) {
        console.error('❌ Multi-character generation failed:', error.message);
    }
}

async function testFallbackCard() {
    console.log('\n🔄 Testing Fallback Card Generation...\n');

    const generator = new PullImageGenerator();

    try {
        const character = {
            id: 'test_001',
            name: 'Test Character',
            anime: 'Test Anime',
            rarity: 'LEGENDARY',
            imageUrl: 'invalid-url' // This will cause the character image to fail
        };

        console.log(`Generating fallback card for: ${character.name} (${character.rarity})`);

        const imageBuffer = await generator.generateCharacterCard(character);

        // Save to file for verification
        const outputPath = path.join(__dirname, '..', 'tests', 'test-fallback-card.png');
        fs.writeFileSync(outputPath, imageBuffer);

        console.log(`✅ Fallback card generated successfully: ${outputPath}`);
        console.log(`   File size: ${imageBuffer.length} bytes`);

    } catch (error) {
        console.error('❌ Fallback card generation failed:', error.message);
    }
}

async function testLargePull() {
    console.log('\n📊 Testing Large Pull (10 characters)...\n');

    const generator = new PullImageGenerator();

    try {
        // Create 10 test characters by duplicating the sample
        const largePull = [];
        for (let i = 0; i < 10; i++) {
            const baseChar = sampleCharacters[i % sampleCharacters.length];
            largePull.push({
                ...baseChar,
                id: `test_${i + 1}`,
                name: `${baseChar.name} ${i + 1}`
            });
        }

        console.log(`Generating large pull results for ${largePull.length} characters`);

        const imageBuffer = await generator.generatePullResultsImage(largePull);

        // Save to file for verification
        const outputPath = path.join(__dirname, '..', 'tests', 'test-large-pull.png');
        fs.writeFileSync(outputPath, imageBuffer);

        console.log(`✅ Large pull results generated successfully: ${outputPath}`);
        console.log(`   File size: ${imageBuffer.length} bytes`);

    } catch (error) {
        console.error('❌ Large pull generation failed:', error.message);
    }
}

async function runAllTests() {
    console.log('🧪 Starting Pull Image Generator Tests...\n');

    try {
        // Ensure test directory exists
        const testDir = path.join(__dirname, '..', 'tests');
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        await testSingleCharacterCard();
        await testMultiCharacterPull();
        await testFallbackCard();
        await testLargePull();

        console.log('\n🎉 All tests completed! Check the generated images in the tests/ directory.');

    } catch (error) {
        console.error('❌ Test suite failed:', error);
    }
}

if (require.main === module) {
    runAllTests();
}

module.exports = {
    testSingleCharacterCard,
    testMultiCharacterPull,
    testFallbackCard,
    testLargePull
};
