/**
 * Test script for Card Leveling System
 * @file test-card-leveling.js
 * @description Tests the new card leveling and merging system
 */

const CardLevelingService = require('../src/services/CardLevelingService');

async function testCardLeveling() {
    console.log('🧪 Testing Card Leveling System...\n');

    const service = new CardLevelingService();

    // Test EXP requirements
    console.log('📊 Level EXP Requirements (first 10 levels):');
    for (let i = 1; i <= 10; i++) {
        console.log(`Level ${i}: ${service.levelExpRequirements[i]} EXP`);
    }

    console.log('\n📊 Level EXP Requirements (levels 95-100):');
    for (let i = 95; i <= 100; i++) {
        console.log(`Level ${i}: ${service.levelExpRequirements[i]} EXP`);
    }

    // Test merge EXP calculation
    console.log('\n🔄 Merge EXP Calculation Test:');
    const testCharacter = { rarity: 'LEGENDARY' };
    const mergeExp = service.calculateMergeExp(testCharacter, 5);
    console.log(`Merging level 5 LEGENDARY duplicate: +${mergeExp} EXP`);

    // Test stat scaling
    console.log('\n⚔️ Stat Scaling Test:');
    const baseCharacter = {
        attack: 100,
        defense: 80,
        speed: 90,
        health: 120,
        rarity: 'EPIC'
    };

    const level1Stats = service.calculateScaledStats(baseCharacter, 1);
    const level50Stats = service.calculateScaledStats(baseCharacter, 50);
    const level100Stats = service.calculateScaledStats(baseCharacter, 100);

    console.log('Base stats (Level 1):', level1Stats);
    console.log('Level 50 stats:', level50Stats);
    console.log('Level 100 stats:', level100Stats);

    console.log('\n✅ Card Leveling Service tests completed!');
}

testCardLeveling();
