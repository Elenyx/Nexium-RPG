/**
 * Test script for CardAlbum functionality
 * @file test-card-album.js
 * @description Tests the CardAlbum service with sample data
 */

const CardAlbum = require('../src/services/CardAlbum');
const fs = require('fs');
const path = require('path');

// Sample character data for testing
const sampleCharacters = [
    {
        id: 'char_001',
        name: 'Naruto Uzumaki',
        rarity: 'LEGENDARY',
        imagePath: 'src/assets/images/characters/naruto.jpg'
    },
    {
        id: 'char_002',
        name: 'Sasuke Uchiha',
        rarity: 'LEGENDARY',
        imagePath: 'src/assets/images/characters/sasuke.png'
    },
    {
        id: 'char_003',
        name: 'Monkey D. Luffy',
        rarity: 'MYTHIC',
        imagePath: 'src/assets/images/characters/luffy.png'
    },
    {
        id: 'char_004',
        name: 'Edward Elric',
        rarity: 'EPIC',
        imagePath: 'src/assets/images/characters/edward.png'
    },
    {
        id: 'char_005',
        name: 'Light Yagami',
        rarity: 'RARE',
        imagePath: 'src/assets/images/characters/light.png'
    },
    {
        id: 'char_006',
        name: 'Tanjiro Kamado',
        rarity: 'RARE',
        imagePath: 'src/assets/images/characters/tanjiro.png'
    },
    {
        id: 'char_007',
        name: 'Goku',
        rarity: 'MYTHIC',
        imagePath: 'src/assets/images/characters/goku.png'
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
