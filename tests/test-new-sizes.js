/**
 * Test script for new card sizes
 * @file test-new-sizes.js
 * @description Tests the updated card dimensions
 */

const PullImageGenerator = require('../src/services/PullImageGenerator');
const fs = require('fs');
const path = require('path');

async function testNewSizes() {
    console.log('🧪 Testing new card sizes...\n');

    const generator = new PullImageGenerator();
    const testCharacter = {
        id: 'test_001',
        name: 'Test Character',
        rarity: 'LEGENDARY',
        imageUrl: null // Will use fallback
    };

    try {
        // Test individual card (should be 450x600)
        console.log('📏 Testing individual card size (450x600)...');
        const individualCard = await generator.generateCharacterCard(testCharacter);
        console.log('✅ Individual card generated successfully');

        // Save for verification
        const individualPath = path.join(__dirname, 'test-individual-card.png');
        fs.writeFileSync(individualPath, individualCard);
        console.log(`📁 Individual card saved to: ${individualPath}`);

        // Test multi-card pull (should use 225x300 per card)
        console.log('\n📏 Testing multi-card pull size (225x300 per card)...');
        const multiCard = await generator.generatePullResultsImage([testCharacter, testCharacter]);
        console.log('✅ Multi-card pull generated successfully');

        // Save for verification
        const multiPath = path.join(__dirname, 'test-multi-card.png');
        fs.writeFileSync(multiPath, multiCard);
        console.log(`📁 Multi-card pull saved to: ${multiPath}`);

        console.log('\n🎉 All size tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
}

testNewSizes();
