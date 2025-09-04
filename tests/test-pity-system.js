/**
 * Test script to demonstrate the pity system mechanics
 */

const GachaService = require('./src/services/GachaService');

async function testPitySystem() {
    const gacha = new GachaService();

    console.log('=== NEXIUM RPG PITY SYSTEM TEST (DIMENSIONAL REMOVED) ===\n');

    // Test pity rate calculations at different counters
    const testCounters = [0, 25, 50, 75, 90, 99];

    console.log('PITY RATE CALCULATIONS:');
    console.log('Base Rates (DIMENSIONAL removed from regular pulls):', JSON.stringify(gacha.rates, null, 2));

    testCounters.forEach(counter => {
        console.log(`\n--- Pity Counter: ${counter} ---`);
        const adjustedRates = gacha.calculatePityRates(counter);
        console.log('Adjusted Rates:', JSON.stringify(adjustedRates, null, 2));

        // Calculate total (should be 100%)
        const total = Object.values(adjustedRates).reduce((sum, rate) => sum + rate, 0);
        console.log(`Total Rate: ${total.toFixed(2)}%`);

        // Show pity bonuses
        if (counter >= gacha.pityConfig.softPityStart) {
            const progress = (counter - gacha.pityConfig.softPityStart) /
                           (gacha.pityConfig.hardPity - gacha.pityConfig.softPityStart);
            console.log(`Pity Progress: ${(progress * 100).toFixed(1)}%`);
        }
    });

    console.log('\n=== PITY SYSTEM CONFIGURATION ===');
    console.log(JSON.stringify(gacha.pityConfig, null, 2));

    console.log('\n=== HOW IT WORKS ===');
    console.log('1. Soft Pity (50+ pulls): Rates gradually increase for high-rarity characters');
    console.log('2. Hard Pity (100 pulls): Guaranteed LEGENDARY or MYTHIC character');
    console.log('3. High-rarity characters: LEGENDARY, MYTHIC (DIMENSIONAL is event-only)');
    console.log('4. Pity resets to 0 when a high-rarity character is pulled');
    console.log('5. DIMENSIONAL characters: Only obtainable via events, raids, or limited banners');
}

// Run the test
testPitySystem().catch(console.error);
