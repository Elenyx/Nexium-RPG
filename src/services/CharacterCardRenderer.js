/**
 * @file CharacterCardRenderer.js
 * @description Generates character card images with dynamic frame overlays using ImageKit.io.
 * @author Your Name
 */

const { IMAGE_KIT_BASE_URL } = require('../config/constants');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class CharacterCardRenderer {

    /**
     * Main method to generate character card - alias for renderCardUrl for consistency
     * @param {object} character - The character object
     * @returns {string} The complete ImageKit URL with transformations or base64 data URL
     */
    async generateCharacterCard(character) {
        return await this.renderCardUrl(character);
    }

    /**
     * Generates a fully-formed ImageKit URL that overlays a rarity frame on a character's base image.
     * Falls back to canvas-generated framed images if ImageKit is unavailable.
     * @param {object} character - The character object from your database/assets.
     * @returns {string} The complete ImageKit URL with transformations or base64 data URL for canvas-generated image.
     */
    async renderCardUrl(character) {
        if (!character || !character.id || !character.rarity) {
            // Return a simple generated card if character data is incomplete
            return this.generateSimpleCard(character || {});
        }

        // Check if ImageKit is available
        if (!(await this.isImageKitAvailable())) {
            // Use canvas to create framed image
            return await this.createFramedImageWithCanvas(character);
        }

        // Construct the base image URL using character ID
        const baseImageUrl = `${IMAGE_KIT_BASE_URL}Characters/${character.id}.png`;

        // Define the path for the rarity frame
        const framePath = `frames/${character.rarity.toUpperCase()}.png`;

        // Construct the ImageKit URL with the overlay transformation
        const transformation = `tr=l-image,i-${framePath},l-end`;

        // Combine the base URL, the base image path, and the transformation query
        const finalUrl = `${baseImageUrl}?${transformation}`;

        return finalUrl;
    }

    /**
     * Create a framed character image using canvas when ImageKit is unavailable
     * @param {object} character - The character object
     * @returns {string} Base64 data URL of the framed image
     */
    async createFramedImageWithCanvas(character) {
        try {
            // Standard card dimensions
            const cardWidth = 400;
            const cardHeight = 560;
            
            const canvas = createCanvas(cardWidth, cardHeight);
            const ctx = canvas.getContext('2d');

            // Draw background with rarity color
            const rarityColors = {
                'COMMON': '#9CA3AF', 'RARE': '#3B82F6', 'EPIC': '#8B5CF6',
                'LEGENDARY': '#F59E0B', 'MYTHIC': '#EF4444', 'DIMENSIONAL': '#7C3AED'
            };
            
            const bgColor = rarityColors[character.rarity.toUpperCase()] || '#9CA3AF';
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, cardWidth, cardHeight);
            
            // Try to load character image if available
            if (character.id) {
                try {
                    const characterImageUrl = `${IMAGE_KIT_BASE_URL}Characters/${character.id}.png`;
                    const characterImage = await this.loadImageFromPath(characterImageUrl);
                    if (characterImage) {
                        // Draw character image with some padding for frame
                        const padding = 20;
                        ctx.drawImage(characterImage, padding, padding, cardWidth - 2*padding, cardHeight - 2*padding);
                    }
                } catch (error) {
                    console.log('Could not load character image for canvas:', error.message);
                }
            }

            // Draw a simple frame border
            this.drawSimpleFrame(ctx, cardWidth, cardHeight, character.rarity);
            
            // Draw character info
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            
            // Character name with outline
            ctx.strokeText(character.name, cardWidth/2, cardHeight - 60);
            ctx.fillText(character.name, cardWidth/2, cardHeight - 60);
            
            // Rarity text
            ctx.font = '18px Arial';
            ctx.strokeText(character.rarity, cardWidth/2, cardHeight - 30);
            ctx.fillText(character.rarity, cardWidth/2, cardHeight - 30);

            // Return as base64 data URL
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.warn('Failed to create canvas framed image:', error.message);
            // Return a simple generated card
            return this.generateSimpleCard(character);
        }
    }

    /**
     * Generate a simple card when all else fails
     * @param {object} character - The character object
     * @returns {string} Base64 data URL of a simple card
     */
    generateSimpleCard(character) {
        const canvas = createCanvas(400, 560);
        const ctx = canvas.getContext('2d');
        
        // Draw simple background
        ctx.fillStyle = '#2C2F33';
        ctx.fillRect(0, 0, 400, 560);
        
        // Draw text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(character.name || 'Character', 200, 280);
        ctx.font = '18px Arial';
        ctx.fillText(character.rarity || 'COMMON', 200, 310);
        
        return canvas.toDataURL('image/png');
    }

    /**
     * Load image from local file path
     * @param {string} imagePath - Path to the image file
     * @returns {Promise<Image>} Loaded image
     */
    async loadImageFromPath(imagePath) {
        const fullPath = path.join(__dirname, '../../', imagePath);
        const imageBuffer = fs.readFileSync(fullPath);
        return await loadImage(imageBuffer);
    }

    /**
     * Get local frame image path for a given rarity
     * @param {string} rarity - The character rarity
     * @returns {string} Local file path to frame image
     */
    getLocalFramePath(rarity) {
        // Return null since we don't want to use local files
        return null;
    }

    /**
     * Draw a simple colored frame border when no frame image is available
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {string} rarity - Character rarity
     */
    drawSimpleFrame(ctx, width, height, rarity) {
        const colors = {
            'COMMON': '#9CA3AF',
            'RARE': '#3B82F6', 
            'EPIC': '#8B5CF6',
            'LEGENDARY': '#F59E0B',
            'MYTHIC': '#EF4444',
            'DIMENSIONAL': '#7C3AED'
        };

        const frameColor = colors[rarity.toUpperCase()] || colors['COMMON'];
        const borderWidth = 8;

        ctx.strokeStyle = frameColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);

        // Add inner glow effect
        ctx.shadowColor = frameColor;
        ctx.shadowBlur = 10;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
        ctx.shadowBlur = 0;
    }

    /**
     * Check if ImageKit service is available
     * @returns {boolean} True if ImageKit appears to be available
     */
    async isImageKitAvailable() {
        try {
            // Test with a known working URL
            const testUrl = 'https://ik.imagekit.io/NexiumRPG/Characters/NC001.png';
            const response = await axios.get(testUrl, {
                timeout: 5000,
                validateStatus: function (status) {
                    return status < 400; // Accept 2xx and 3xx
                }
            });
            return response.status === 200;
        } catch (error) {
            console.warn('ImageKit availability check failed:', error.message);
            return false;
        }
    }
}

module.exports = CharacterCardRenderer;

