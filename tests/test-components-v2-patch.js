/**
 * @file Components V2 Patch Test
 * @description Test for the Components V2 patch
 */

// First, apply the patch
const { applyDiscordComponentsV2Patch } = require('../src/utils/ComponentsV2Patch');
applyDiscordComponentsV2Patch();

// Now load discord.js components
const { 
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    ThumbnailBuilder
} = require('discord.js');

// Test simple section
try {
    console.log('Testing SectionBuilder with TextDisplay...');
    const section = new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent('Test content')
        );
    const json = section.toJSON();
    console.log('Section JSON:', json);
    console.log('✅ SectionBuilder test passed');
} catch (error) {
    console.error('❌ SectionBuilder test failed:', error);
    process.exit(1);
}

// Test complex container
try {
    console.log('\nTesting complex container...');
    const container = new ContainerBuilder()
        .setAccentColor(0x3B82F6)
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent('# Title')
        )
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('Section Text 1'),
                    new TextDisplayBuilder()
                        .setContent('Section Text 2')
                )
        );
    
    const json = container.toJSON();
    console.log('Container JSON:', json);
    console.log('✅ Container test passed');
} catch (error) {
    console.error('❌ Container test failed:', error);
    process.exit(1);
}

// Test with buttons
try {
    console.log('\nTesting ActionRow with buttons...');
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('button1')
                .setLabel('Button 1')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('button2')
                .setLabel('Button 2')
                .setStyle(ButtonStyle.Secondary)
        );
    
    const json = row.toJSON();
    console.log('ActionRow JSON:', json);
    console.log('✅ ActionRow test passed');
} catch (error) {
    console.error('❌ ActionRow test failed:', error);
    process.exit(1);
}

console.log('\n🎉 All tests passed!');
