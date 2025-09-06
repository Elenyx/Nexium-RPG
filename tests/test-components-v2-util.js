/**
 * @file ComponentsV2 Utility Test
 * @description Tests for our ComponentsV2 utility that fixes validation issues
 */

const ComponentsV2 = require('../src/utils/ComponentsV2');
const assert = require('assert');

console.log('Testing ComponentsV2 Utility');

// Test ButtonBuilder
try {
    console.log('Testing ButtonBuilder...');
    const button = new ComponentsV2.ButtonBuilder()
        .setCustomId('test_button')
        .setLabel('Test Button')
        .setStyle(ComponentsV2.ButtonStyle.Primary);
    const json = button.toJSON();
    console.log('✅ ButtonBuilder validated successfully');
} catch (error) {
    console.error('❌ ButtonBuilder validation failed:', error);
    process.exit(1);
}

// Test SectionBuilder with TextDisplay
try {
    console.log('Testing SectionBuilder with TextDisplay...');
    const section = new ComponentsV2.SectionBuilder()
        .addTextDisplayComponents(
            new ComponentsV2.TextDisplayBuilder()
                .setContent('Test content')
        );
    const json = section.toJSON();
    console.log('✅ SectionBuilder validated successfully');
} catch (error) {
    console.error('❌ SectionBuilder validation failed:', error);
    process.exit(1);
}

// Test ContainerBuilder with SectionBuilder
try {
    console.log('Testing ContainerBuilder with SectionBuilder...');
    const container = new ComponentsV2.ContainerBuilder()
        .addSectionComponents(
            new ComponentsV2.SectionBuilder()
                .addTextDisplayComponents(
                    new ComponentsV2.TextDisplayBuilder()
                        .setContent('Test content')
                )
        );
    const json = container.toJSON();
    console.log('✅ ContainerBuilder validated successfully');
} catch (error) {
    console.error('❌ ContainerBuilder validation failed:', error);
    process.exit(1);
}

// Test ThumbnailBuilder
try {
    console.log('Testing ThumbnailBuilder...');
    const thumbnail = new ComponentsV2.ThumbnailBuilder()
        .setURL('https://example.com/image.png');
    const json = thumbnail.toJSON();
    console.log('✅ ThumbnailBuilder validated successfully');
} catch (error) {
    console.error('❌ ThumbnailBuilder validation failed:', error);
    process.exit(1);
}

// Test helper functions
try {
    console.log('Testing helper functions...');
    
    // Test createErrorContainer
    const errorContainer = ComponentsV2.createErrorContainer('Test error message');
    assert(errorContainer && typeof errorContainer.toJSON === 'function');
    
    // Test createButton
    const button = ComponentsV2.createButton('test_id', 'Test Button', ComponentsV2.ButtonStyle.Primary, '⭐');
    assert(button && typeof button.toJSON === 'function');
    
    // Test createActionRow
    const actionRow = ComponentsV2.createActionRow([button]);
    assert(actionRow && typeof actionRow.toJSON === 'function');
    
    // Test createSection
    const section = ComponentsV2.createSection(['Text 1', 'Text 2']);
    assert(section && typeof section.toJSON === 'function');
    
    console.log('✅ Helper functions validated successfully');
} catch (error) {
    console.error('❌ Helper functions validation failed:', error);
    process.exit(1);
}

// Test complex combined components
try {
    console.log('Testing complex combined components...');
    
    const container = new ComponentsV2.ContainerBuilder()
        .setAccentColor(0x3B82F6)
        .addTextDisplayComponents(
            new ComponentsV2.TextDisplayBuilder()
                .setContent('# Title')
        )
        .addSectionComponents(
            new ComponentsV2.SectionBuilder()
                .addTextDisplayComponents(
                    new ComponentsV2.TextDisplayBuilder()
                        .setContent('Section Text 1'),
                    new ComponentsV2.TextDisplayBuilder()
                        .setContent('Section Text 2')
                )
        )
        .addActionRowComponents(
            new ComponentsV2.ActionRowBuilder()
                .addComponents(
                    new ComponentsV2.ButtonBuilder()
                        .setCustomId('button_1')
                        .setLabel('Button 1')
                        .setStyle(ComponentsV2.ButtonStyle.Primary),
                    new ComponentsV2.ButtonBuilder()
                        .setCustomId('button_2')
                        .setLabel('Button 2')
                        .setStyle(ComponentsV2.ButtonStyle.Secondary)
                )
        );
    
    const json = container.toJSON();
    console.log('✅ Complex components validated successfully');
} catch (error) {
    console.error('❌ Complex components validation failed:', error);
    process.exit(1);
}

console.log('\n🎉 All ComponentsV2 tests passed!');
