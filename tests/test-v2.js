/**
 * Quick test for Components V2 character collection
 */
const CharacterCollection = require('./src/components/builders/CharacterCollection');
const sampleCharacters = require('./src/assets/sample/SampleCharacters');

async function testComponentsV2() {
  const mockUser = { id: '123', username: 'TestUser', displayAvatarURL: () => 'avatar.jpg' };
  const result = await CharacterCollection.createModernCollectionEmbed(sampleCharacters, mockUser, 1, 2);

  console.log('🎯 Components V2 Test Results:');
  console.log('✅ Has components:', !!result.components);
  console.log('📊 Component count:', result.components?.length || 0);
  console.log('❌ Has embeds:', !!result.embeds);
  console.log('🏷️  Has flags:', !!result.flags);
  console.log('🔢 Flags value:', result.flags);

  // Check first component structure
  if (result.components && result.components.length > 0) {
    const firstComp = result.components[0];
    console.log('🏗️  First component type:', firstComp.constructor.name);
    if (firstComp.data) {
      console.log('🎨 Has accent color:', !!firstComp.data.accent_color);
    }
  }

  console.log('\n🎉 Test completed successfully!');
}

testComponentsV2().catch(console.error);
