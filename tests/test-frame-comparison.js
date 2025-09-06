/**
 * Test script for frame comparison feature
 */

const CharacterCardRenderer = require('./src/services/CharacterCardRenderer');
const fs = require('fs');

async function testFrameComparison() {
    console.log('🖼️ Testing Frame Comparison Feature...\n');

    const renderer = new CharacterCardRenderer();

    // Test character data
    const testCharacter = {
        id: 'NC001',
        name: 'Test Character',
        rarity: 'RARE'
    };

    try {
        // Test frame comparison
        const comparisonImage = await renderer.generateFrameComparison(
            testCharacter,
            null, // Current frame (default rarity)
            'shop_fire' // New frame
        );

        if (comparisonImage && comparisonImage.startsWith('data:image')) {
            console.log('✅ Frame comparison image generated successfully!');
            console.log('📏 Image size:', comparisonImage.length, 'characters');

            // Save to file for testing
            const base64Data = comparisonImage.split(',')[1];
            const imageBuffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync('test-frame-comparison.png', imageBuffer);
            console.log('💾 Saved comparison image as test-frame-comparison.png');
        } else {
            console.log('❌ Failed to generate comparison image');
        }

        // Test single frame rendering
        const singleFrame = await renderer.generateSingleFrameImage(
            testCharacter,
            'shop_fire',
            null
        );

        if (singleFrame) {
            console.log('✅ Single frame image generated successfully!');
        } else {
            console.log('❌ Failed to generate single frame image');
        }

    } catch (error) {
        console.error('❌ Error during testing:', error);
    }
}

// Run the test
testFrameComparison().then(() => {
    console.log('\n🎉 Frame comparison testing completed!');
});
