/**
 * Test script for CardAlbum functionality
 * @file test-card-album.js
 * @description Tests the CardAlbum service with sample data
 */

const CardAlbum = require('../src/services/CardAlbum');
const fs = require('fs');
const path = require('path');

// Sample character data for testing - using actual characters from assets
const sampleCharacters = [
    {
        id: 'NL001',
        name: 'Jiraiya',
        rarity: 'LEGENDARY',
        anime: 'Naruto'
    },
    {
        id: 'NL002',
        name: 'Tsunade Senju',
        rarity: 'LEGENDARY',
        anime: 'Naruto'
    },
    {
        id: 'NM001',
        name: 'Naruto Uzumaki (Kurama Chakra Mode)',
        rarity: 'MYTHIC',
        anime: 'Naruto'
    },
    {
        id: 'NE001',
        name: 'Kakashi Hatake',
        rarity: 'EPIC',
        anime: 'Naruto'
    },
    {
        id: 'NR001',
        name: 'Shikamaru Nara',
        rarity: 'RARE',
        anime: 'Naruto'
    },
    {
        id: 'NC001',
        name: 'Konohamaru',
        rarity: 'COMMON',
        anime: 'Naruto'
    },
    {
        id: 'ND001',
        name: 'Hagoromo Otsutsuki',
        rarity: 'DIMENSIONAL',
        anime: 'Naruto'
    }
];

async function testCardAlbum() {
    console.log('🖼️  Testing CardAlbum Service...\n');

    try {
        const cardAlbum = new CardAlbum();
        const mockUser = {
            id: '123456789',
            username: 'TestUser'
        };

        console.log('📄 Generating collection album...');
        const albumBuffer = await cardAlbum.generateAlbum(sampleCharacters, 0, mockUser);

        // Save the generated image for verification
        const outputPath = path.join(__dirname, 'test-collection.png');
        fs.writeFileSync(outputPath, albumBuffer);

        console.log('✅ Card album generated successfully!');
        console.log(`📁 Image saved to: ${outputPath}`);
        console.log(`📊 Image size: ${(albumBuffer.length / 1024).toFixed(2)} KB`);
        console.log(`👥 Characters displayed: ${Math.min(sampleCharacters.length, 8)}`);
        console.log(`📖 Total pages needed: ${Math.ceil(sampleCharacters.length / 8)}`);

        // Test pagination
        if (sampleCharacters.length > 8) {
            console.log('\n📄 Testing pagination (Page 2)...');
            const page2Buffer = await cardAlbum.generateAlbum(sampleCharacters, 1, mockUser);
            const page2Path = path.join(__dirname, 'test-collection-page2.png');
            fs.writeFileSync(page2Path, page2Buffer);
            console.log(`📁 Page 2 saved to: ${page2Path}`);
        }

    } catch (error) {
        console.error('❌ CardAlbum test failed:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testCardAlbum().then(() => {
    console.log('\n🎉 CardAlbum test completed!');
}).catch(error => {
    console.error('💥 Test failed with error:', error);
});
