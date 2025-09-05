/**
 * Test script for CharacterCardRenderer with character name rendering
 * @file test-character-name-rendering.js
 * @description Tests the character name text overlay functionality
 */

const CharacterCardRenderer = require('../src/services/CharacterCardRenderer');
const fs = require('fs');
const path = require('path');

async function testCharacterNameRendering() {
    console.log('🎨 Testing Character Card Renderer with Name Rendering...\n');

    try {
        const renderer = new CharacterCardRenderer();

        // Mock character data for testing
        const testCharacter = {
            id: 'test_char_001',
            name: 'Test Character Name',
            anime: 'Test Anime',
            rarity: 'RARE'
        };

        // Test rendering with default frame
        console.log('📝 Testing character name rendering...');

        // Since we don't have actual character images, we'll test the text rendering logic
        const canvas = require('canvas').createCanvas(900, 1200);
        const ctx = canvas.getContext('2d');

        // Fill with a test background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 900, 1200);

        // Test the character name rendering
        renderer.renderCharacterName(ctx, testCharacter);

        // Save the test image
        const buffer = canvas.toBuffer('image/png');
        const outputPath = path.join(__dirname, 'test-character-name.png');
        fs.writeFileSync(outputPath, buffer);

        console.log('✅ Character name rendering test completed!');
        console.log(`📁 Test image saved to: ${outputPath}`);
        console.log('🎯 Character name should appear at bottom with transparent background');

    } catch (error) {
        console.error('❌ Character name rendering test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testCharacterNameRendering().catch(console.error);
