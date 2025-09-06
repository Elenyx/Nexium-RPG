/**
 * Test script to verify ImageKit.io image loading with Canvas
 */

const { createCanvas, loadImage } = require('canvas');
const { IMAGE_KIT_BASE_URL } = require('./src/config/constants');

async function testImageKitConnection() {
    console.log('🧪 Testing ImageKit.io connection and image loading...\n');

    // Test 1: Check ImageKit availability
    console.log('1️⃣ Testing ImageKit availability...');
    try {
        const testUrl = `${IMAGE_KIT_BASE_URL}Characters/NC001.png`;
        console.log(`   Testing URL: ${testUrl}`);

        const axios = require('axios');
        const response = await axios.head(testUrl, { timeout: 10000 });

        if (response.status === 200) {
            console.log('   ✅ ImageKit is accessible');
        } else {
            console.log(`   ❌ ImageKit returned status: ${response.status}`);
        }
    } catch (error) {
        console.log(`   ❌ ImageKit connection failed: ${error.message}`);
    }

    // Test 2: Test canvas image loading
    console.log('\n2️⃣ Testing Canvas image loading...');
    try {
        const testImageUrl = `${IMAGE_KIT_BASE_URL}Characters/NC001.png`;
        console.log(`   Loading image: ${testImageUrl}`);

        const image = await loadImage(testImageUrl);
        console.log(`   ✅ Image loaded successfully: ${image.width}x${image.height}`);

        // Test 3: Create canvas and draw image
        console.log('\n3️⃣ Testing Canvas drawing...');
        const canvas = createCanvas(400, 560);
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = '#2C2F33';
        ctx.fillRect(0, 0, 400, 560);

        // Draw image
        ctx.drawImage(image, 20, 20, 360, 480);
        console.log('   ✅ Image drawn on canvas successfully');

        // Test 4: Export as base64
        const base64 = canvas.toDataURL('image/png');
        console.log(`   ✅ Canvas exported as base64 (${base64.length} characters)`);

    } catch (error) {
        console.log(`   ❌ Canvas image loading failed: ${error.message}`);
    }

    // Test 3: Test CharacterCardRenderer with real character
    console.log('\n4️⃣ Testing CharacterCardRenderer with real character...');
    try {
        const CharacterCardRenderer = require('./src/services/CharacterCardRenderer');
        const renderer = new CharacterCardRenderer();

        // Test with a real character from the database
        const testCharacter = {
            id: 'NC001',
            name: 'Naruto Uzumaki',
            rarity: 'COMMON'
        };

        console.log('   Testing renderCardUrl with NC001...');
        const cardUrl = await renderer.renderCardUrl(testCharacter);
        console.log(`   ✅ Card URL generated: ${cardUrl.substring(0, 100)}...`);

        console.log('   Testing generateCharacterCard with NC001...');
        const cardResult = await renderer.generateCharacterCard(testCharacter);
        if (cardResult.startsWith('data:image')) {
            console.log('   ✅ Canvas fallback generated base64 image');
        } else {
            console.log(`   ✅ ImageKit URL generated: ${cardResult.substring(0, 100)}...`);
        }

        // Test frame rendering
        console.log('   Testing renderCardWithFrame...');
        const framedCard = await renderer.renderCardWithFrame(testCharacter, 'rare');
        if (framedCard.startsWith('data:image')) {
            console.log('   ✅ Framed card generated with canvas fallback');
        } else {
            console.log(`   ✅ Framed ImageKit URL generated: ${framedCard.substring(0, 100)}...`);
        }

    } catch (error) {
        console.log(`   ❌ CharacterCardRenderer test failed: ${error.message}`);
    }

    console.log('\n🎉 ImageKit and Canvas testing completed!');
}

// Run the test
testImageKitConnection().catch(console.error);
