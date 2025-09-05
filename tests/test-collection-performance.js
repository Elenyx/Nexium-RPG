/**
 * Test script for collection performance optimizations
 * @file test-collection-performance.js
 * @description Tests the performance improvements for collection album generation
 */

const CardAlbum = require('../src/services/CardAlbum');
const CharacterCardRenderer = require('../src/services/CharacterCardRenderer');

async function testCollectionPerformance() {
    console.log('🚀 Testing Collection Performance Optimizations...\n');

    // Mock character data
    const mockCharacters = [
        { id: 'NC001', name: 'Naruto Uzumaki', rarity: 'LEGENDARY', anime: 'Naruto' },
        { id: 'NC002', name: 'Sasuke Uchiha', rarity: 'LEGENDARY', anime: 'Naruto' },
        { id: 'NC003', name: 'Sakura Haruno', rarity: 'EPIC', anime: 'Naruto' },
        { id: 'NC004', name: 'Kakashi Hatake', rarity: 'MYTHIC', anime: 'Naruto' },
        { id: 'NC005', name: 'Itachi Uchiha', rarity: 'DIMENSIONAL', anime: 'Naruto' },
        { id: 'NC006', name: 'Hinata Hyuga', rarity: 'RARE', anime: 'Naruto' },
        { id: 'NC007', name: 'Shikamaru Nara', rarity: 'RARE', anime: 'Naruto' },
        { id: 'NC008', name: 'Choji Akimichi', rarity: 'COMMON', anime: 'Naruto' },
        { id: 'NC009', name: 'Ino Yamanaka', rarity: 'RARE', anime: 'Naruto' },
        { id: 'NC010', name: 'Rock Lee', rarity: 'EPIC', anime: 'Naruto' }
    ];

    const mockUser = { id: 'test_user_123', username: 'TestUser' };
    const cardAlbum = new CardAlbum();

    try {
        console.log('📊 Testing Album Generation Performance...\n');

        // Test 1: First generation (no cache)
        console.log('1️⃣ First album generation (cold cache):');
        const startTime1 = Date.now();
        const album1 = await cardAlbum.generateAlbum(mockCharacters, 0, mockUser);
        const endTime1 = Date.now();
        console.log(`   ⏱️  Time: ${endTime1 - startTime1}ms`);
        console.log(`   📏 Size: ${album1.length} bytes\n`);

        // Test 2: Second generation (should use cache)
        console.log('2️⃣ Second album generation (warm cache):');
        const startTime2 = Date.now();
        const album2 = await cardAlbum.generateAlbum(mockCharacters, 0, mockUser);
        const endTime2 = Date.now();
        console.log(`   ⏱️  Time: ${endTime2 - startTime2}ms`);
        console.log(`   📏 Size: ${album2.length} bytes\n`);

        // Test 3: Different page (new cache entry)
        console.log('3️⃣ Different page generation:');
        const startTime3 = Date.now();
        const album3 = await cardAlbum.generateAlbum(mockCharacters, 1, mockUser);
        const endTime3 = Date.now();
        console.log(`   ⏱️  Time: ${endTime3 - startTime3}ms`);
        console.log(`   📏 Size: ${album3.length} bytes\n`);

        // Test 4: Same page again (should use cache)
        console.log('4️⃣ Same page again (should be cached):');
        const startTime4 = Date.now();
        const album4 = await cardAlbum.generateAlbum(mockCharacters, 1, mockUser);
        const endTime4 = Date.now();
        console.log(`   ⏱️  Time: ${endTime4 - startTime4}ms`);
        console.log(`   📏 Size: ${album4.length} bytes\n`);

        // Display cache statistics
        const cacheStats = cardAlbum.getCacheStats();
        console.log('📈 Cache Statistics:');
        console.log(`   Albums cached: ${cacheStats.albums}`);
        console.log(`   Images cached: ${cacheStats.images}`);
        console.log(`   Total cache entries: ${cacheStats.total}\n`);

        // Performance comparison
        const improvement = ((endTime1 - endTime2) / endTime1 * 100).toFixed(1);
        console.log('🎯 Performance Results:');
        console.log(`   First run: ${endTime1 - startTime1}ms`);
        console.log(`   Cached run: ${endTime2 - startTime2}ms`);
        console.log(`   Improvement: ${improvement}% faster\n`);

        console.log('✅ Performance test completed successfully!');

    } catch (error) {
        console.error('❌ Performance test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testCollectionPerformance().catch(console.error);
