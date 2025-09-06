/**
 * @file Discord Components V2 Utility
 * @description Helper utilities for working with Discord.js Components V2
 * 
 * NOTE: This utility relies on the patch being applied in index.js first
 * via the ComponentsV2Patch.applyDiscordComponentsV2Patch() function
 */

// Import discord.js components directly
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

/**
 * Creates a simple error container with just a text message
 * @param {string} errorMessage - The error message to display
 * @returns {ContainerBuilder} A container with the error message
 */
function createErrorContainer(errorMessage) {
    return new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(errorMessage || 'An error occurred. Please try again later.')
        );
}

/**
 * Creates a text container with content and optional accent color
 * @param {string} content - The content to display
 * @param {number} accentColor - Optional hex color code
 * @returns {ContainerBuilder} A container with the content
 */
function createTextContainer(content, accentColor) {
    const container = new ContainerBuilder();
    
    if (accentColor) {
        container.setAccentColor(accentColor);
    }
    
    return container.addTextDisplayComponents(
        new TextDisplayBuilder()
            .setContent(content)
    );
}

/**
 * Creates a thumbnail for use in containers
 * @param {string} url - The URL of the image
 * @returns {ThumbnailBuilder} A thumbnail builder
 */
function createThumbnail(url) {
    return new ThumbnailBuilder()
        .setURL(url); // Note: it's setURL not setUrl
}

/**
 * Creates a section with multiple text displays
 * @param {Array<string>} contentArray - Array of text content
 * @returns {SectionBuilder} A section with multiple text displays
 */
function createSection(contentArray) {
    const section = new SectionBuilder();
    
    const textDisplays = contentArray.map(content => 
        new TextDisplayBuilder().setContent(content)
    );
    
    return section.addTextDisplayComponents(...textDisplays);
}

/**
 * Creates a button with standard properties
 * @param {string} customId - The button's custom ID
 * @param {string} label - The button's label text
 * @param {number} style - ButtonStyle enum value
 * @param {string} emoji - Optional emoji
 * @returns {ButtonBuilder} A button builder
 */
function createButton(customId, label, style = ButtonStyle.Secondary, emoji = null) {
    const button = new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);
        
    if (emoji) {
        button.setEmoji(emoji);
    }
    
    return button;
}

/**
 * Creates an action row with buttons
 * @param {Array<ButtonBuilder>} buttons - Button builders to add
 * @returns {ActionRowBuilder} An action row with buttons
 */
function createActionRow(buttons) {
    return new ActionRowBuilder().addComponents(...buttons);
}

module.exports = {
    // Re-export discord.js classes
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    MessageFlags,
    
    // Helper functions
    createErrorContainer,
    createTextContainer,
    createThumbnail,
    createSection,
    createButton,
    createActionRow
};
