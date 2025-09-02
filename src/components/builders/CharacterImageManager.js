/**
 * @file Character Image Manager
 * @description Manages character images for the RPG system with external URL support
 * @author Nexium Bot Development Team
 */

const fs = require('fs');
const path = require('path');

class CharacterImageManager {
    constructor() {
        this.basePath = path.join(__dirname, '..', '..', 'assets', 'images', 'characters');
        this.supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

        // External CDN configuration for large collections
        this.externalCDN = {
            baseUrl: 'https://elenyx.github.io/Nexium-RPG/characters/',
            fallbackUrl: 'https://via.placeholder.com/',
            // CDN mapping for character IDs
            characterMap: {
                'char_001': 'naruto.jpg',
                'char_002': 'sasuke.png',
                'char_003': 'luffy.png',
                'char_004': 'edward.png',
                'char_005': 'goku.png',
                'char_006': 'light.png',
                'char_007': 'tanjiro.png',
                // Add more mappings as needed
            }
        };

        // Image optimization settings
        this.imageSettings = {
            maxWidth: 256,
            maxHeight: 256,
            quality: 80,
            format: 'webp' // Smaller file size
        };
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
     * Gets optimized image URL for character (prioritizes external CDN)
     * @param {string} characterId - Character ID
     * @returns {string|null} Optimized image URL or null if not found
     */
    getOptimizedCharacterImageUrl(characterId) {
        // First try external CDN (fastest for large collections)
        if (this.externalCDN.characterMap[characterId]) {
            return `${this.externalCDN.baseUrl}${this.externalCDN.characterMap[characterId]}`;
        }

        // Fallback to local file if available (convert to external URL)
        const localPath = this.getCharacterImagePath(characterId);
        if (localPath) {
            // For Components V2, convert local path to external URL
            return this.getPlaceholderImageUrl(characterId);
        }

        return null;
    }

    /**
     * Gets placeholder/fallback image URL
     * @param {string} characterId - Character ID
     * @returns {string} Placeholder image URL
     */
    getPlaceholderImageUrl(characterId) {
        // Use a service like placeholder.com or your own placeholder
        const rarityColors = {
            'COMMON': 'gray',
            'RARE': 'blue',
            'EPIC': 'purple',
            'LEGENDARY': 'gold',
            'MYTHIC': 'red',
            'DIMENSIONAL': 'orange'
        };

        // Extract rarity from character ID or use default
        const color = rarityColors.COMMON; // Default fallback
        return `https://via.placeholder.com/256x256/${color}/ffffff?text=${encodeURIComponent(characterId)}`;
    }

    /**
     * Validates if external image URL is accessible
     * @param {string} url - Image URL to validate
     * @returns {Promise<boolean>} True if URL is accessible
     */
    async validateImageUrl(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.warn(`Failed to validate image URL: ${url}`, error.message);
            return false;
        }
    }

    /**
     * Gets multiple character images with caching
     * @param {Array} characterIds - Array of character IDs
     * @returns {Promise<Object>} Object mapping character IDs to image URLs
     */
    async getBulkCharacterImages(characterIds) {
        const results = {};
        const promises = characterIds.map(async (id) => {
            const url = this.getOptimizedCharacterImageUrl(id);
            if (url) {
                const isValid = await this.validateImageUrl(url);
                results[id] = isValid ? url : this.getPlaceholderImageUrl(id);
            } else {
                results[id] = this.getPlaceholderImageUrl(id);
            }
        });

        await Promise.all(promises);
        return results;
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
     * Loads character image URL for Components V2 (external URLs only)
     * @param {Object} character - Character data object
     * @returns {Promise<Object>} Promise resolving to {success: boolean, url: string|null, error: string|null}
     */
    async loadCharacterImage(character) {
        try {
            const characterId = character.id || character.name?.toLowerCase().replace(/\s+/g, '_');

            if (!characterId) {
                return {
                    success: false,
                    url: null,
                    error: 'No character ID or name provided'
                };
            }

            // First priority: External CDN URL (fastest for large collections)
            const cdnUrl = this.getOptimizedCharacterImageUrl(characterId);
            if (cdnUrl && cdnUrl !== this.getPlaceholderImageUrl(characterId)) {
                const isValid = await this.validateImageUrl(cdnUrl);
                if (isValid) {
                    return {
                        success: true,
                        url: cdnUrl,
                        source: 'cdn'
                    };
                }
            }

            // Second priority: Character's own imageUrl
            if (character.imageUrl && character.imageUrl.startsWith('http')) {
                const isValid = await this.validateImageUrl(character.imageUrl);
                if (isValid) {
                    return {
                        success: true,
                        url: character.imageUrl,
                        source: 'character'
                    };
                }
            }

            // Third priority: Local file (convert to external URL)
            const localPath = this.getCharacterImagePath(characterId);
            if (localPath) {
                // Instead of creating attachment, use placeholder for now
                console.warn(`Local image found for ${characterId} but using placeholder. Upload to CDN for better performance.`);
                return {
                    success: true,
                    url: this.getPlaceholderImageUrl(characterId),
                    source: 'placeholder',
                    suggestion: 'upload_to_cdn'
                };
            }

            // Final fallback: Placeholder image
            return {
                success: true,
                url: this.getPlaceholderImageUrl(characterId),
                source: 'placeholder'
            };

        } catch (error) {
            console.error(`Error loading image for character ${character.name || 'unknown'}:`, error);
            return {
                success: false,
                url: null,
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
        const imageUrl = hasImage ? this.getOptimizedCharacterImageUrl(character.id) : null;

        return {
            ...character,
            hasImage,
            imageUrl,
            displayImage: imageUrl || this.getPlaceholderImageUrl(character.id)
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
