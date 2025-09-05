/**
 * @file CharacterCardRenderer.js
 * @description Generates character card images with dynamic frame overlays using ImageKit.io.
 * @author Your Name
 */

const { IMAGE_KIT_BASE_URL } = require('../config/constants');

class CharacterCardRenderer {

    /**
     * Generates a fully-formed ImageKit URL that overlays a rarity frame on a character's base image.
     * @param {object} character - The character object from your database/assets.
     * @returns {string} The complete ImageKit URL with transformations.
     */
    renderCardUrl(character) {
        if (!character || !character.image || !character.rarity) {
            // Return a placeholder if character data is incomplete
            return 'https://ik.imagekit.io/nexiumrpg/placeholder.png';
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
}

module.exports = new CharacterCardRenderer();

