/**
 * Test script for character collection with image integration
 * @file test-character-collection.js
 * @description Tests the CharacterCollection builder with CharacterImageManager integration
 */

const CharacterCollection = require('./src/components/builders/CharacterCollection');
const sampleCharacters = require('./src/assets/sample/SampleCharacters');

async function testCharacterCollection() {
    console.log('🧪 Testing Character Collection with Image Integration...\n');

    // Mock Discord user object
    const mockUser = {
        id: '123456789',
        username: 'TestUser',
        displayAvatarURL: () => 'https://example.com/avatar.jpg'
    };

    try {
        // Test 1: Modern Collection View
        console.log('📱 Testing Modern Collection View...');
        const modernCollection = await CharacterCollection.createModernCollectionEmbed(
            sampleCharacters,
            mockUser,
            1,
            2
        );

        console.log('✅ Modern collection created successfully');
        console.log(`   - Components: ${modernCollection.components.length}`);
        console.log(`   - Files: ${modernCollection.files ? modernCollection.files.length : 0}`);
        console.log(`   - Content: ${modernCollection.content ? 'Present' : 'None'}`);

        // Test 2: Adaptive Collection (Modern)
        console.log('\n🔄 Testing Adaptive Collection (Modern)...');
        const adaptiveModern = await CharacterCollection.createAdaptiveCollection(
            sampleCharacters,
            mockUser,
            'modern',
            1,
            2
        );

        console.log('✅ Adaptive modern collection created successfully');

        // Test 3: Adaptive Collection (Classic)
        console.log('\n📄 Testing Adaptive Collection (Classic)...');
        const adaptiveClassic = await CharacterCollection.createAdaptiveCollection(
            sampleCharacters,
            mockUser,
            'classic',
            1,
            2
        );

        console.log('✅ Adaptive classic collection created successfully');

        // Test 4: Character Detail View
        console.log('\n👤 Testing Character Detail View...');
        const characterDetail = await CharacterCollection.createCharacterDetailEmbed(
            sampleCharacters[0], // Naruto
            mockUser
        );

        console.log('✅ Character detail created successfully');
        console.log(`   - Embeds: ${characterDetail.embeds.length}`);
        console.log(`   - Components: ${characterDetail.components.length}`);
        console.log(`   - Files: ${characterDetail.files ? characterDetail.files.length : 0}`);

        console.log('\n🎉 All tests passed! Character collection with image integration is working.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testCharacterCollection().catch(console.error);
