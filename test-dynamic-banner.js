/**
 * @file test-dynamic-banner.js
 * @description Test script for DynamicBannerGenerator service
 * @author Nexium Bot Development Team
 */

const DynamicBannerGenerator = require('./src/services/DynamicBannerGenerator');
const fs = require('fs');
const path = require('path');

async function testDynamicBanner() {
    console.log('🎨 Testing Dynamic Banner Generator...\n');

    const generator = new DynamicBannerGenerator();

    // Mock user object (simulating Discord user)
    const mockUser = {
        id: '123456789',
        username: 'TestUser',
        displayAvatarURL: (options) => {
            // Return null to test fallback avatar
            return null;
        }
    };

    // Mock server stats
    const mockServerStats = {
        members: '1,234',
        characters: '57+',
        battles: 'Active',
        economy: 'Thriving'
    };

    try {
        console.log('📝 Generating welcome banner...');
        const bannerUrl = await generator.createWelcomeBanner(mockUser, mockServerStats, {
            timestamp: true
        });

        console.log('✅ Banner generated successfully!');
        console.log('🔗 Banner URL:', bannerUrl);

        // Save the banner locally if it's a data URL
        if (bannerUrl.startsWith('data:image/png;base64,')) {
            const base64Data = bannerUrl.replace('data:image/png;base64,', '');
            const buffer = Buffer.from(base64Data, 'base64');
            const outputPath = path.join(__dirname, 'test-welcome-banner.png');
            fs.writeFileSync(outputPath, buffer);
            console.log('💾 Banner saved locally:', outputPath);
        }

        // Also test custom banner
        console.log('\n📝 Generating custom banner...');
        const customBannerUrl = await generator.createCustomBanner({
            title: '🎉 Special Event!',
            subtitle: 'Limited Time Offer',
            backgroundColor: '#FF6B6B'
        });

        console.log('✅ Custom banner generated successfully!');
        console.log('🔗 Custom Banner URL:', customBannerUrl);

        // Save custom banner locally if it's a data URL
        if (customBannerUrl.startsWith('data:image/png;base64,')) {
            const base64Data = customBannerUrl.replace('data:image/png;base64,', '');
            const buffer = Buffer.from(base64Data, 'base64');
            const outputPath = path.join(__dirname, 'test-custom-banner.png');
            fs.writeFileSync(outputPath, buffer);
            console.log('💾 Custom banner saved locally:', outputPath);
        }

        console.log('\n🎉 All tests completed successfully!');
        console.log('📁 Check the generated PNG files in the project root.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testDynamicBanner();
}

module.exports = { testDynamicBanner };
