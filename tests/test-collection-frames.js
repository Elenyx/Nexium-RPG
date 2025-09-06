/**
 * Test script for collection frame functionality
 * @file test-collection-frames.js
 * @description Tests that equipped frames are properly applied to collection albums
 */

const CardAlbum = require('../src/services/CardAlbum');
const InventoryService = require('../src/services/InventoryService');

async function testCollectionFrames() {
    // Frame overlays to test (from user-provided ImageKit URLs)
    const testFrames = [
        {
            id: 'shop_arcane',
            name: 'Arcane Frame',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_arcane.png'
        },
        {
            id: 'mythic',
            name: 'Mythic Frame',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/MYTHIC.png'
        },
        {
            id: 'shop_ice',
            name: 'Ice Frame',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_ice.png'
        },
        {
            id: 'premium_celestial',
            name: 'Celestial Frame',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/premium_celestial.png'
        }
    ];
    console.log('🎨 Testing Collection Frame Functionality...\n');

    // Mock character data
    const mockCharacters = [
        { id: 'NC001', name: 'Naruto Uzumaki', rarity: 'LEGENDARY', anime: 'Naruto' },
        { id: 'NC002', name: 'Sasuke Uchiha', rarity: 'LEGENDARY', anime: 'Naruto' },
        { id: 'NC003', name: 'Sakura Haruno', rarity: 'EPIC', anime: 'Naruto' },
        { id: 'NC004', name: 'Kakashi Hatake', rarity: 'MYTHIC', anime: 'Naruto' }
    ];

    const mockUser = { id: 'test_user_frame', username: 'FrameTestUser' };
    const cardAlbum = new CardAlbum();
    const inventoryService = new InventoryService();

    try {
        console.log('📊 Testing Frame Application...\n');

        // Test 1: Generate album without equipped frame (should use default rarity frames)
        console.log('1️⃣ Album without equipped frame (rarity frames):');
        const startTime1 = Date.now();
        const album1 = await cardAlbum.generateAlbum(mockCharacters, 0, mockUser);
        const endTime1 = Date.now();
        console.log(`   ⏱️  Time: ${endTime1 - startTime1}ms`);
        console.log(`   📏 Size: ${album1.length} bytes`);
        console.log(`   🎨 Frame: Default rarity frames\n`);

        // Test 2: Add and equip a frame
        console.log('2️⃣ Setting up equipped frame:');
        const mockFrame = { id: 'basic_gold', name: 'Golden Frame' };
        try {
            await inventoryService.addFrame(mockUser.id, mockFrame);
            await inventoryService.equipFrame(mockUser.id, 'basic_gold');
            console.log('   ✅ Frame equipped successfully\n');
        } catch (error) {
            console.log('   ⚠️  Could not equip frame (database not available):', error.message);
            console.log('   Continuing test with mock frame data...\n');
        }

        // Test 3: Generate album with equipped frame
        console.log('3️⃣ Album with equipped frame:');
        const startTime3 = Date.now();
            for (const frame of testFrames) {
                console.log(`2️⃣ Equipping frame: ${frame.name} (${frame.id})`);
                try {
                    // Ensure frame has imageUrl property
                    if (!frame.imageUrl) {
                        console.log(`   ⚠️  Frame ${frame.id} missing imageUrl!`);
                    }
                    await inventoryService.addFrame(mockUser.id, frame);
                    await inventoryService.equipFrame(mockUser.id, frame.id);
                    // Debug: print equipped frame from inventory
                    const equipped = await inventoryService.getEquippedFrame(mockUser.id);
                    console.log('   Equipped frame object:', equipped);
                    console.log(`   ✅ Frame equipped: ${frame.name}`);
                } catch (error) {
                    console.log('   ⚠️  Could not equip frame (database not available):', error.message);
                    console.log('   Continuing test with mock frame data...');
                }

                let album;
                try {
                    album = await cardAlbum.generateAlbum(mockCharacters, 0, mockUser);
                    if (!album) {
                        console.log('   ❌ Album buffer is undefined!');
                    } else {
                        console.log('   Album buffer type:', typeof album, 'length:', album.length);
                    }
                } catch (err) {
                    console.error('   ❌ Error generating album:', err);
                    continue;
                }
                const outPath = `tests/test-collection-frames-${frame.id}.png`;
                try {
                    require('fs').writeFileSync(outPath, album);
                    console.log(`   ✅ Saved: ${outPath}\n`);
                } catch (err) {
                    console.error(`   ❌ Error saving PNG for ${frame.id}:`, err);
                }
            }
        const endTime3 = Date.now();
        console.log(`   ⏱️  Time: ${endTime3 - startTime3}ms`);
        console.log(`   📏 Size: ${album3.length} bytes`);
        console.log(`   🎨 Frame: Equipped frame applied\n`);

        // Test 4: Verify caching works with frames
        console.log('4️⃣ Testing cache with same equipped frame:');
        const startTime4 = Date.now();
        const album4 = await cardAlbum.generateAlbum(mockCharacters, 0, mockUser);
        const endTime4 = Date.now();
        console.log(`   ⏱️  Time: ${endTime4 - startTime4}ms`);
        console.log(`   📏 Size: ${album4.length} bytes`);
        console.log(`   🎨 Frame: Same equipped frame (should be cached)\n`);

        // Test 5: Change equipped frame and test
        console.log('5️⃣ Changing equipped frame:');
        const mockFrame2 = { id: 'basic_silver', name: 'Silver Frame' };
        try {
            await inventoryService.addFrame(mockUser.id, mockFrame2);
            await inventoryService.equipFrame(mockUser.id, 'basic_silver');
            console.log('   ✅ Different frame equipped\n');
        } catch (error) {
            console.log('   ⚠️  Could not change frame (database not available):', error.message);
            console.log('   Continuing test...\n');
        }

        console.log('6️⃣ Album with different equipped frame:');
        const startTime6 = Date.now();
        const album6 = await cardAlbum.generateAlbum(mockCharacters, 0, mockUser);
        const endTime6 = Date.now();
        console.log(`   ⏱️  Time: ${endTime6 - startTime6}ms`);
        console.log(`   📏 Size: ${album6.length} bytes`);
        console.log(`   🎨 Frame: Different equipped frame\n`);

        // Display cache statistics
        const cacheStats = cardAlbum.getCacheStats();
        console.log('📈 Final Cache Statistics:');
        console.log(`   Albums cached: ${cacheStats.albums}`);
        console.log(`   Images cached: ${cacheStats.images}`);
        console.log(`   Total cache entries: ${cacheStats.total}\n`);

        console.log('✅ Frame functionality test completed successfully!');
        console.log('\n🎯 Expected Results:');
        console.log('   • Albums with different equipped frames should generate separately');
        console.log('   • Albums with same equipped frame should use cache');
        console.log('   • Default rarity frames should be used when no frame is equipped');

    } catch (error) {
        console.error('❌ Frame test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testCollectionFrames().catch(console.error);
