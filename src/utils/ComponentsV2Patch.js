/**
 * @file Components V2 Discord.js Patch
 * @description Patch for Discord.js Components V2 validation errors
 */

/**
 * Applies the necessary patches to make Discord.js Components V2 work
 * This must be called before any Components V2 are created/used
 */
function applyDiscordComponentsV2Patch() {
    console.log('Applying Discord.js Components V2 patch...');
    
    try {
        // Import the necessary modules
        const discord = require('discord.js');
        
        // Register the builder classes globally
        global.ButtonBuilder = discord.ButtonBuilder;
        global.ThumbnailBuilder = discord.ThumbnailBuilder;
        
        // Monkey patch the validation system directly in discord.js
        const builders = require('@discordjs/builders');
        
        // Get access to original validation method
        const originalSectionToJSON = builders.SectionBuilder.prototype.toJSON;
        
        // Override the toJSON method to bypass validation
        builders.SectionBuilder.prototype.toJSON = function() {
            try {
                // Try the original first
                return originalSectionToJSON.call(this);
            } catch (error) {
                // If validation fails, return a valid object structure manually
                console.warn('Discord.js validation error bypassed in SectionBuilder');
                
                return {
                    type: 13, // Section type
                    components: this.components.map(c => {
                        if (c.toJSON) return c.toJSON();
                        return c;
                    })
                };
            }
        };
        
        console.log('✅ Discord.js Components V2 patch applied successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to apply Discord.js Components V2 patch:', error);
        return false;
    }
}

module.exports = {
    applyDiscordComponentsV2Patch
};
