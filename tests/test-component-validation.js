/**
 * @file Component Validation Test
 * @description Test Discord.js Components V2 validation
 */

// Import Components V2 builders
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

// Import assertion library
const assert = require('assert');
const { describe, it } = require('mocha');

describe('Discord.js Components V2 Validation', function() {
    it('should create valid Container with TextDisplay', function() {
        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent('Test content')
            );
        
        // If toJSON doesn't throw, it's valid
        const json = container.toJSON();
        assert(json.components.length > 0);
    });

    it('should create valid Container with Section', function() {
        const container = new ContainerBuilder()
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent('Test content')
                    )
            );
        
        // If toJSON doesn't throw, it's valid
        const json = container.toJSON();
        assert(json.components.length > 0);
    });

    it('should create valid Button', function() {
        const button = new ButtonBuilder()
            .setCustomId('test_button')
            .setLabel('Test Button')
            .setStyle(ButtonStyle.Primary);
        
        // If toJSON doesn't throw, it's valid
        const json = button.toJSON();
        assert(json.style === ButtonStyle.Primary);
    });

    it('should create valid ActionRow with Button', function() {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('test_button')
                    .setLabel('Test Button')
                    .setStyle(ButtonStyle.Primary)
            );
        
        // If toJSON doesn't throw, it's valid
        const json = row.toJSON();
        assert(json.components.length > 0);
    });

    it('should create valid Container with Section and ActionRow', function() {
        const container = new ContainerBuilder()
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent('Test content')
                    )
            )
            .addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('test_button')
                            .setLabel('Test Button')
                            .setStyle(ButtonStyle.Primary)
                    )
            );
        
        // If toJSON doesn't throw, it's valid
        const json = container.toJSON();
        assert(json.components.length > 0);
    });
});

// Create a simple runner function to execute tests directly
if (require.main === module) {
    console.log('Running Discord.js Components V2 validation tests');
    
    // Create a simple test runner
    const runTest = (name, testFn) => {
        try {
            console.log(`Test: ${name}`);
            testFn();
            console.log(`✓ Passed`);
            return true;
        } catch (error) {
            console.error(`✗ Failed: ${error.message}`);
            return false;
        }
    };
    
    // Run all tests
    const tests = [
        'Container with TextDisplay',
        'Container with Section',
        'Button',
        'ActionRow with Button',
        'Container with Section and ActionRow'
    ];
    
    const container1 = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent('Test content')
        );
    
    const container2 = new ContainerBuilder()
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('Test content')
                )
        );
    
    const button = new ButtonBuilder()
        .setCustomId('test_button')
        .setLabel('Test Button')
        .setStyle(ButtonStyle.Primary);
    
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('test_button')
                .setLabel('Test Button')
                .setStyle(ButtonStyle.Primary)
        );
    
    const container3 = new ContainerBuilder()
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('Test content')
                )
        )
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('test_button')
                        .setLabel('Test Button')
                        .setStyle(ButtonStyle.Primary)
                )
        );
    
    const results = [
        runTest('Container with TextDisplay', () => {
            const json = container1.toJSON();
            assert(json.components.length > 0);
        }),
        runTest('Container with Section', () => {
            const json = container2.toJSON();
            assert(json.components.length > 0);
        }),
        runTest('Button', () => {
            const json = button.toJSON();
            assert(json.style === ButtonStyle.Primary);
        }),
        runTest('ActionRow with Button', () => {
            const json = row.toJSON();
            assert(json.components.length > 0);
        }),
        runTest('Container with Section and ActionRow', () => {
            const json = container3.toJSON();
            assert(json.components.length > 0);
        })
    ];
    
    const passed = results.filter(r => r).length;
    const failed = results.filter(r => !r).length;
    
    console.log(`\nTests complete: ${passed} passed, ${failed} failed`);
    
    if (failed > 0) {
        process.exit(1);
    }
}
