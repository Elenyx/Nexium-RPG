require('dotenv').config();
const CharacterCardRenderer = require('./src/services/CharacterCardRenderer');
const { sequelize, models } = require('./src/database/connection');

async function testImageLoading() {
    console.log('🔍 Testing Image Loading and Canvas Rendering...\n');

    try {
        // Connect to database
        if (!sequelize) {
            console.log('❌ Database not configured');
            return;
        }

        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Initialize renderer
        const renderer = new CharacterCardRenderer();

        // Test ImageKit availability
        console.log('📡 Testing ImageKit availability...');
        const imageKitAvailable = await renderer.isImageKitAvailable();
        console.log(`ImageKit available: ${imageKitAvailable ? '✅' : '❌'}`);

        // Get a few test characters from database
        const Character = models.Character;
        const characters = await Character.findAll({ limit: 5 });
        console.log(`\n📊 Found ${characters.length} characters in database`);

        for (const character of characters) {
            console.log(`\n🎴 Testing character: ${character.name} (${character.id})`);

            try {
                // Test ImageKit URL generation
                const imageKitUrl = await renderer.renderCardUrl(character);
                console.log(`ImageKit URL: ${imageKitUrl.substring(0, 100)}...`);

                // Test canvas fallback
                console.log('🎨 Testing canvas rendering...');
                const canvasResult = await renderer.createFramedImageWithCanvas(character);
                console.log(`Canvas result type: ${typeof canvasResult}`);
                console.log(`Canvas result length: ${canvasResult.length}`);

                // Check if it's a valid base64 data URL
                if (canvasResult.startsWith('data:image/png;base64,')) {
                    console.log('✅ Canvas generated valid base64 image');
                } else {
                    console.log('❌ Canvas did not generate valid base64 image');
                }

            } catch (error) {
                console.log(`❌ Error testing character ${character.name}: ${error.message}`);
            }
        }

        console.log('\n🎉 Image loading test completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testImageLoading();
