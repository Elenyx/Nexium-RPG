/**
 * @file Discord.js V2 Components Test
 * @description Examples of valid Component V2 structures
 */

const discord = require('discord.js');

// Check if we have V2 Components available
console.log('Discord.js version:', discord.version);

// Create a proper SectionBuilder example
console.log('\nTesting SectionBuilder:');
try {
    const section = new discord.SectionBuilder()
        .addTextDisplayComponents(
            new discord.TextDisplayBuilder()
                .setContent('Test content')
        );
    console.log('Section toJSON:', JSON.stringify(section.toJSON(), null, 2));
    console.log('✅ SectionBuilder test passed');
} catch (error) {
    console.error('❌ SectionBuilder test failed:', error);
}

// Test ThumbnailBuilder
console.log('\nTesting ThumbnailBuilder:');
try {
    // Check if ThumbnailBuilder exists and what methods it has
    console.log('ThumbnailBuilder exists:', !!discord.ThumbnailBuilder);
    if (discord.ThumbnailBuilder) {
        console.log('ThumbnailBuilder methods:', 
            Object.getOwnPropertyNames(discord.ThumbnailBuilder.prototype)
                .filter(name => name !== 'constructor')
        );
        
        const thumbnail = new discord.ThumbnailBuilder();
        // Use correct method to set URL if available
        if (typeof thumbnail.setUrl === 'function') {
            thumbnail.setUrl('https://example.com/image.png');
        } else if (typeof thumbnail.setURL === 'function') {
            thumbnail.setURL('https://example.com/image.png'); 
        } else {
            console.log('Available methods on instance:', 
                Object.getOwnPropertyNames(Object.getPrototypeOf(thumbnail))
                    .filter(name => name !== 'constructor')
            );
        }
        
        console.log('Thumbnail toJSON:', JSON.stringify(thumbnail, null, 2));
        console.log('✅ ThumbnailBuilder test passed');
    }
} catch (error) {
    console.error('❌ ThumbnailBuilder test failed:', error);
}

// Test all available builder types in discord.js
console.log('\nAvailable Component Builders:');
[
    'ActionRowBuilder',
    'ButtonBuilder',
    'ContainerBuilder',
    'SectionBuilder',
    'TextDisplayBuilder',
    'ThumbnailBuilder',
    'EmbedBuilder'
].forEach(builder => {
    if (discord[builder]) {
        console.log(`✅ ${builder} is available`);
    } else {
        console.log(`❌ ${builder} is NOT available`);
    }
});

// Create a simple but valid container
console.log('\nCreating a valid container:');
try {
    const container = new discord.ContainerBuilder()
        .addTextDisplayComponents(
            new discord.TextDisplayBuilder()
                .setContent('This is valid content')
        );
    
    // Validate the container
    console.log('Valid container JSON:', JSON.stringify(container.toJSON(), null, 2));
    console.log('✅ Container validation passed');
} catch (error) {
    console.error('❌ Container validation failed:', error);
}
