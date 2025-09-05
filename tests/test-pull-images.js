/**
 * Test script for PullImageGenerator
 * @file test-pull-images.js
 * @description Tests the Canvas-based pull result image generation
 */

const PullImageGenerator = require('../src/services/PullImageGenerator');
const fs = require('fs');
const path = require('path');

// Sample character data for testing (using corrected ImageKit URLs with character IDs)
const sampleCharacters = [
    {
        id: 'NC001',
        name: 'Naruto Uzumaki',
        anime: 'Naruto',
        rarity: 'COMMON',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/NC001.png'
    },
    {
        id: 'NC002',
        name: 'Sasuke Uchiha',
        anime: 'Naruto',
        rarity: 'COMMON',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/NC002.png'
    },
    {
        id: 'NC003',
        name: 'Sakura Haruno',
        anime: 'Naruto',
        rarity: 'COMMON',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/NC003.png'
    },
    {
        id: 'NR001',
        name: 'Shikamaru Nara',
        anime: 'Naruto',
        rarity: 'RARE',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/NR001.png'
    },
    {
        id: 'NE001',
        name: 'Kakashi Hatake',
        anime: 'Naruto',
        rarity: 'EPIC',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/NE001.png'
    },
    {
        id: 'NL001',
        name: 'Jiraiya',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/NL001.png'
    },
    {
        id: 'NM001',
        name: 'Naruto Uzumaki (Kurama Chakra Mode)',
        anime: 'Naruto',
        rarity: 'MYTHIC',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/NM001.png'
    },
    {
        id: 'ND001',
        name: 'Kaguya Otsutsuki',
        anime: 'Naruto',
        rarity: 'DIMENSIONAL',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/ND001.png'
    }
];

async function testSingleCharacterCard() {
    console.log('🖼️ Testing Single Character Card Generation...\n');

    const generator = new PullImageGenerator();

    try {
        const character = sampleCharacters[0]; // Naruto
        console.log(`Generating card for: ${character.name} (${character.rarity})`);
        console.log(`Using ImageKit URL: ${character.imageUrl}`);

        const imageBuffer = await generator.generateCharacterCard(character);

        // Save to file for verification
        const outputPath = path.join(__dirname, '..', 'tests', 'test-card.png');
        fs.writeFileSync(outputPath, imageBuffer);

        console.log(`✅ Card generated successfully: ${outputPath}`);
        console.log(`   File size: ${imageBuffer.length} bytes`);

    } catch (error) {
        console.error('❌ Single card generation failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

async function testMultiCharacterPull() {
    console.log('\n🎯 Testing Multi-Character Pull Results...\n');

    const generator = new PullImageGenerator();

    try {
        // Test with 3 characters from different rarities
        const testCharacters = [
            sampleCharacters[0], // COMMON - Naruto
            sampleCharacters[3], // RARE - Shikamaru
            sampleCharacters[4]  // EPIC - Kakashi
        ];
        console.log(`Generating pull results for ${testCharacters.length} characters:`);
        testCharacters.forEach(char => {
            console.log(`   - ${char.name} (${char.rarity})`);
            console.log(`     ImageKit URL: ${char.imageUrl}`);
        });

        const imageBuffer = await generator.generatePullResultsImage(testCharacters);

        // Save to file for verification
        const outputPath = path.join(__dirname, '..', 'tests', 'test-pull-results.png');
        fs.writeFileSync(outputPath, imageBuffer);

        console.log(`✅ Pull results generated successfully: ${outputPath}`);
        console.log(`   File size: ${imageBuffer.length} bytes`);

    } catch (error) {
        console.error('❌ Multi-character pull failed:', error.message);
        console.error('Stack trace:', error.stack);
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
