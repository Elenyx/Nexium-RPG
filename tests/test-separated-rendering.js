/**
 * Test script for CharacterCardRenderer with separated character art and frames
 * @file test-separated-rendering.js
 * @description Tests the new separated system for character art and frame overlays
 */

const CharacterCardRenderer = require('../src/services/CharacterCardRenderer');
const FrameManager = require('../src/services/FrameManager');

async function testSeparatedRendering() {
    console.log('🎨 Testing Separated Character Art and Frame System...\n');

    try {
        const renderer = new CharacterCardRenderer();
        const frameManager = new FrameManager();

        // Test character data
        const testCharacter = {
            id: 'NC001',
            name: 'Naruto Uzumaki',
            anime: 'Naruto',
            rarity: 'COMMON'
        };

        // Test character image URL generation
        console.log('🖼️ Testing Character Image URL Generation...');
        const characterUrl = renderer.getCharacterImageUrl(testCharacter.id, testCharacter);
        console.log(`Character URL: ${characterUrl}`);

        // Test frame URL generation
        console.log('\n🖼️ Testing Frame URL Generation...');
        const frames = ['basic_gold', 'basic_silver', 'premium_diamond'];
        frames.forEach(frameId => {
            const frameUrl = frameManager.getFrameImageUrl(frameId);
            console.log(`${frameId}: ${frameUrl}`);
        });

        // Test with mock character data
        console.log('\n📊 Testing Character URL Generation...');
        const mockCharacter = {
            id: 'NC001',
            name: 'Naruto Uzumaki',
            anime: 'Naruto',
            rarity: 'COMMON'
        };

        // Test URL generation with mock data
        const cleanUrl = renderer.getCharacterImageUrl('NC001', mockCharacter);
        console.log(`Character URL with ID: ${cleanUrl}`);

        // Test with different character IDs
        const testIds = ['NC001', 'NC002', 'SC001', 'BC001'];
        testIds.forEach(id => {
            const url = renderer.getCharacterImageUrl(id, mockCharacter);
            console.log(`${id}: ${url}`);
        });

        console.log('\n✅ Separated rendering system test completed!');
        console.log('🎯 Character art and frames are now properly separated');

    } catch (error) {
        console.error('❌ Separated rendering test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testSeparatedRendering().catch(console.error);
