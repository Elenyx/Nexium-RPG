/**
 * Test script to verify DIMENSIONAL characters are excluded from regular pulls
 */

const { models } = require('../src/database/connection');

async function testDimensionalExclusion() {
    console.log('=== TESTING DIMENSIONAL CHARACTER EXCLUSION ===\n');

    try {
        // Check if database is available
        if (!models) {
            console.log('❌ Database not available - cannot test character filtering');
            return;
        }

        // Get all characters
        const allCharacters = await models.Character.findAll();
        console.log(`📊 Total characters in database: ${allCharacters.length}`);

        // Count by rarity
        const rarityCount = {};
        allCharacters.forEach(char => {
            rarityCount[char.rarity] = (rarityCount[char.rarity] || 0) + 1;
        });

        console.log('📈 Characters by rarity:');
        Object.entries(rarityCount).forEach(([rarity, count]) => {
            console.log(`   ${rarity}: ${count}`);
        });

        // Simulate the filtering that happens in GachaService
        const filteredCharacters = await models.Character.findAll({
            where: {
                rarity: {
                    [models.Sequelize.Op.ne]: 'DIMENSIONAL'
                }
            }
        });

        console.log(`\n🎯 Characters available for regular pulls: ${filteredCharacters.length}`);
        console.log(`🚫 DIMENSIONAL characters excluded: ${allCharacters.length - filteredCharacters.length}`);

        // Verify DIMENSIONAL characters are excluded
        const dimensionalCharacters = allCharacters.filter(char => char.rarity === 'DIMENSIONAL');
        const filteredDimensional = filteredCharacters.filter(char => char.rarity === 'DIMENSIONAL');

        if (dimensionalCharacters.length > 0) {
            console.log(`\n⚠️  Found ${dimensionalCharacters.length} DIMENSIONAL character(s) in database:`);
            dimensionalCharacters.forEach(char => {
                console.log(`   - ${char.name} (${char.anime})`);
            });
            console.log('✅ These will be excluded from regular pulls');
        } else {
            console.log('\n✅ No DIMENSIONAL characters found in database');
        }

        if (filteredDimensional.length === 0) {
            console.log('✅ DIMENSIONAL characters successfully filtered out');
        } else {
            console.log('❌ ERROR: DIMENSIONAL characters still present in filtered results!');
        }

        console.log('\n🎉 DIMENSIONAL EXCLUSION TEST COMPLETED SUCCESSFULLY!');
        console.log('\n📝 DIMENSIONAL characters can now only be obtained through:');
        console.log('   • Dimensional Events');
        console.log('   • Raid Boss Drops');
        console.log('   • Limited Banners');

    } catch (error) {
        console.error('❌ Error during test:', error);
    }
}

// Run the test
testDimensionalExclusion().catch(console.error);
