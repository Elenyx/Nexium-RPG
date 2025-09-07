/**
 * @file Component Validation Test
 * @description Simple test for Discord.js Components V2 validation
 */

const { 
    ButtonBuilder,
    ButtonStyle, 
    ActionRowBuilder, 
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    MessageFlags 
} = require('discord.js');

// Test ContainerBuilder with TextDisplay
try {
    console.log('Testing ContainerBuilder with TextDisplay...');
    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent('Test content')
        );
    const json = container.toJSON();
    console.log('✅ Container with TextDisplay validated successfully');
} catch (error) {
    console.error('❌ Container with TextDisplay validation failed:', error.message);
}

// Test SectionBuilder with TextDisplay
try {
    console.log('Testing SectionBuilder with TextDisplay...');
    const section = new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent('Test content')
        );
    const json = section.toJSON();
    console.log('✅ Section with TextDisplay validated successfully');
} catch (error) {
    console.error('❌ Section with TextDisplay validation failed:', error.message);
}

// Test ButtonBuilder
try {
    console.log('Testing ButtonBuilder...');
    const button = new ButtonBuilder()
        .setCustomId('test_button')
        .setLabel('Test Button')
        .setStyle(ButtonStyle.Primary);
    const json = button.toJSON();
    console.log('✅ ButtonBuilder validated successfully');
} catch (error) {
    console.error('❌ ButtonBuilder validation failed:', error.message);
}

// Test ActionRowBuilder with ButtonBuilder
try {
    console.log('Testing ActionRowBuilder with ButtonBuilder...');
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test_button')
                .setLabel('Test Button')
                .setStyle(ButtonStyle.Primary)
        );
    const json = row.toJSON();
    console.log('✅ ActionRowBuilder with ButtonBuilder validated successfully');
} catch (error) {
    console.error('❌ ActionRowBuilder with ButtonBuilder validation failed:', error.message);
}

// Test ThumbnailBuilder
try {
    console.log('Testing ThumbnailBuilder...');
    const thumbnail = new ThumbnailBuilder()
        .setUrl('https://example.com/image.png');
    const json = thumbnail.toJSON();
    console.log('✅ ThumbnailBuilder validated successfully');
} catch (error) {
    console.error('❌ ThumbnailBuilder validation failed:', error.message);
}

// Test complex container
try {
    console.log('Testing complex container...');
    const container = new ContainerBuilder()
        .setAccentColor(0x3B82F6)
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent('# Test Title')
        )
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('Section content 1'),
                    new TextDisplayBuilder()
                        .setContent('Section content 2')
                )
        )
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('test_button1')
                        .setLabel('Button 1')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('test_button2')
                        .setLabel('Button 2')
                        .setStyle(ButtonStyle.Secondary)
                )
        );
    const json = container.toJSON();
    console.log('✅ Complex container validated successfully');
} catch (error) {
    console.error('❌ Complex container validation failed:', error.message);
}
