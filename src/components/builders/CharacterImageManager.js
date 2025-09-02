/**
 * @file Character Image Manager
 * @description Manages character images for the RPG system
 * @author Nexium Bot Development Team
 */

const fs = require('fs');
const path = require('path');

class CharacterImageManager {
    constructor() {
        this.basePath = path.join(__dirname, '..', '..', 'assets', 'images', 'characters');
        this.supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    }

    /**
     * Gets the full path for a character image
     * @param {string} characterId - Character ID
     * @param {string} format - Image format (optional)
     * @returns {string|null} Full path to image or null if not found
     */
    getCharacterImagePath(characterId, format = null) {
        // Try different formats if no specific format provided
        if (!format) {
            for (const ext of this.supportedFormats) {
                const imagePath = path.join(this.basePath, `${characterId}${ext}`);
                if (fs.existsSync(imagePath)) {
                    return imagePath;
                }
            }
            return null;
        }

        const imagePath = path.join(this.basePath, `${characterId}${format}`);
        return fs.existsSync(imagePath) ? imagePath : null;
    }

    /**
     * Gets Discord attachment URL for character image
     * @param {string} characterId - Character ID
     * @returns {string|null} Discord attachment URL or null if not found
     */
    getCharacterImageUrl(characterId) {
        const imagePath = this.getCharacterImagePath(characterId);
        if (!imagePath) return null;

        // For Discord attachments, we need to return the path that will be used
        // The actual attachment:// URL will be generated when sending the message
        return `attachment://${characterId}${path.extname(imagePath)}`;
    }

    /**
     * Gets all available character images
     * @returns {Array} Array of character IDs that have images
     */
    getAvailableCharacterImages() {
        try {
            const files = fs.readdirSync(this.basePath);
            const characterIds = [];

            for (const file of files) {
                const ext = path.extname(file);
                if (this.supportedFormats.includes(ext)) {
                    const characterId = path.basename(file, ext);
                    characterIds.push(characterId);
                }
            }

            return characterIds;
        } catch (error) {
            console.error('Error reading character images directory:', error);
            return [];
        }
    }

    /**
     * Creates Discord attachment object for character image
     * @param {string} characterId - Character ID
     * @returns {Object|null} Discord attachment object or null if not found
     */
    createCharacterAttachment(characterId) {
        const imagePath = this.getCharacterImagePath(characterId);
        if (!imagePath) return null;

        return {
            attachment: imagePath,
            name: `${characterId}${path.extname(imagePath)}`
        };
    }

    /**
     * Validates if a character has an image
     * @param {string} characterId - Character ID
     * @returns {boolean} True if character has an image
     */
    hasCharacterImage(characterId) {
        return this.getCharacterImagePath(characterId) !== null;
    }

    /**
     * Gets image metadata
     * @param {string} characterId - Character ID
     * @returns {Object|null} Image metadata or null if not found
     */
    getImageMetadata(characterId) {
        const imagePath = this.getCharacterImagePath(characterId);
        if (!imagePath) return null;

        try {
            const stats = fs.statSync(imagePath);
            return {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                format: path.extname(imagePath),
                path: imagePath
            };
        } catch (error) {
            console.error('Error getting image metadata:', error);
            return null;
        }
    }

    /**
     * Loads character image for Discord attachment
     * @param {Object} character - Character data object
     * @returns {Promise<Object>} Promise resolving to {success: boolean, attachment: Object|null, filename: string|null}
     */
    async loadCharacterImage(character) {
        try {
            const characterId = character.id || character.name?.toLowerCase().replace(/\s+/g, '_');

            if (!characterId) {
                return {
                    success: false,
                    attachment: null,
                    filename: null,
                    error: 'No character ID or name provided'
                };
            }

            const attachment = this.createCharacterAttachment(characterId);

            if (attachment) {
                return {
                    success: true,
                    attachment: attachment.attachment,
                    filename: attachment.name
                };
            } else {
                // Try fallback to character's imageUrl if available
                if (character.imageUrl) {
                    return {
                        success: true,
                        attachment: character.imageUrl,
                        filename: `external_${characterId}.jpg`
                    };
                }

                return {
                    success: false,
                    attachment: null,
                    filename: null,
                    error: 'No image found for character'
                };
            }
        } catch (error) {
            console.error(`Error loading image for character ${character.name || 'unknown'}:`, error);
            return {
                success: false,
                attachment: null,
                filename: null,
                error: error.message
            };
        }
    }

    /**
     * Prepares character data with image information
     * @param {Object} character - Character data
     * @returns {Object} Character data with image info
     */
    prepareCharacterWithImage(character) {
        const hasImage = this.hasCharacterImage(character.id);
        const imageUrl = hasImage ? this.getCharacterImageUrl(character.id) : null;
        const attachment = hasImage ? this.createCharacterAttachment(character.id) : null;

        return {
            ...character,
            hasImage,
            imageUrl,
            attachment,
            displayImage: imageUrl || this.getPlaceholderImage(character.rarity)
        };
    }

    /**
     * Prepares multiple characters with image information
     * @param {Array} characters - Array of character data
     * @returns {Array} Characters with image info
     */
    prepareCharactersWithImages(characters) {
        return characters.map(character => this.prepareCharacterWithImage(character));
    }
}

module.exports = CharacterImageManager;
