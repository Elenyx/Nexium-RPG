/**
 * @file CharacterCardRenderer.js
 * @description Generates character card images with dynamic frame overlays using ImageKit.io.
 * @author Your Name
 */

const { IMAGE_KIT_BASE_URL } = require('../config/constants');

class CharacterCardRenderer {

    /**
     * Generates a fully-formed ImageKit URL that overlays a rarity frame on a character's base image.
     * Falls back to local images if ImageKit is unavailable.
     * @param {object} character - The character object from your database/assets.
     * @returns {string} The complete ImageKit URL with transformations or local fallback path.
     */
    renderCardUrl(character) {
        if (!character || !character.image || !character.rarity) {
            // Return a local placeholder if character data is incomplete
            return this.getLocalFallbackPath('placeholder');
        }

        // Check if ImageKit is available (we'll implement a simple check)
        if (!this.isImageKitAvailable()) {
            return this.getLocalFallbackPath(character.rarity.toLowerCase());
        }

        // The base image URL for the character (e.g., from your characters.js files)
        const baseImageUrl = character.image;

        // Extract the path from the full URL to use in the transformation
        // Example: "characters/Naruto/COMMON/NC001.png"
        const baseImagePath = baseImageUrl.replace(IMAGE_KIT_BASE_URL, '');

        // Define the path for the rarity frame. The frame images should be named after the rarity.
        // Example: "frames/RARE.png"
        const framePath = `frames/${character.rarity.toUpperCase()}.png`;

        // Construct the ImageKit URL with the overlay transformation
        // tr=l-image... tells ImageKit to start a layer transformation.
        // i- is the path to the image to overlay.
        // l-end marks the end of the layer.
        const transformation = `tr=l-image,i-${framePath},l-end`;

        // Combine the base URL, the base image path, and the transformation query.
        const finalUrl = `${IMAGE_KIT_BASE_URL}${baseImagePath}?${transformation}`;

        return finalUrl;
    }

    /**
     * Check if ImageKit service is available
     * @returns {boolean} True if ImageKit appears to be available
     */
    isImageKitAvailable() {
        // For now, we'll assume ImageKit is down since the account is suspended
        // In a production environment, you might want to implement a health check
        return false;
    }

    /**
     * Get local fallback image path for a given rarity or type
     * @param {string} type - The type of fallback image needed (rarity or 'placeholder')
     * @returns {string} Local file path to fallback image
     */
    getLocalFallbackPath(type) {
        const path = require('path');
        const fallbackImages = {
            'common': 'test-fallback-card.png',
            'rare': 'test-fallback-card.png',
            'epic': 'test-fallback-card.png',
            'legendary': 'test-fallback-card.png',
            'mythic': 'test-fallback-card.png',
            'dimensional': 'test-fallback-card.png',
            'placeholder': 'test-fallback-card.png'
        };

        const imageName = fallbackImages[type.toLowerCase()] || 'test-fallback-card.png';
        return path.join(__dirname, '../../tests', imageName);
    }
}

module.exports = new CharacterCardRenderer();

