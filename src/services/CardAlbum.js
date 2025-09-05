/**
 * CardAlbum.js - Canvas-based character collection image generator
 * Generates beautiful character card albums for Discord using skia-canvas
 */

const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const CharacterImageManager = require('../components/builders/CharacterImageManager');
const CharacterCardRenderer = require('./CharacterCardRenderer');

class CardAlbum {
    constructor() {
        this.canvasWidth = 800;
        this.canvasHeight = 650;
        this.cardsPerPage = 8;
        // Optimized card size for 8 cards (4x2 grid) on 800x650 canvas - larger for better quality
        this.cardWidth = 180; // Keep same for layout, but images will be higher quality
        this.cardHeight = Math.round(this.cardWidth * 4 / 3); // ~240px for 3:4 ratio
        this.margin = 20;
        this.cardSpacing = 10;
        this.characterImageManager = new CharacterImageManager();
    }

    /**
     * Generate a character collection album image
     * @param {Array} characters - Array of character objects with image paths
     * @param {number} page - Page number (0-based)
     * @param {Object} user - User object for personalization
     * @returns {Buffer} PNG image buffer
     */
    async generateAlbum(characters, page = 0, user = null) {
        const canvas = createCanvas(this.canvasWidth, this.canvasHeight);
        const ctx = canvas.getContext('2d');

        // Fill background with gradient
        this.drawGradientBackground(ctx);

        // Calculate pagination
        const startIndex = page * this.cardsPerPage;
        const endIndex = Math.min(startIndex + this.cardsPerPage, characters.length);
        const pageCharacters = characters.slice(startIndex, endIndex);

        // Draw character cards (centered)
        await this.drawCharacterCards(ctx, pageCharacters, startIndex);

        return canvas.toBuffer('image/png');
    }

    /**
     * Draw gradient background
     */
    drawGradientBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Draw character cards on the canvas
     */
    async drawCharacterCards(ctx, characters, startIndex) {
        const cardsPerRow = 4;
        const rows = Math.ceil(characters.length / cardsPerRow);

        // Calculate total grid dimensions
        const totalGridWidth = cardsPerRow * this.cardWidth + (cardsPerRow - 1) * this.cardSpacing;
        const totalGridHeight = rows * this.cardHeight + (rows - 1) * this.cardSpacing;

        // Center the grid on canvas
        const startX = (this.canvasWidth - totalGridWidth) / 2;
        const startY = (this.canvasHeight - totalGridHeight) / 2;

        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;

            const x = startX + col * (this.cardWidth + this.cardSpacing);
            const y = startY + row * (this.cardHeight + this.cardSpacing);

            await this.drawCharacterCard(ctx, character, x, y, startIndex + i + 1);
        }
    }

    /**
     * Draw a single character card
     */
    async drawCharacterCard(ctx, character, x, y, cardNumber) {
        try {
            // Use CharacterCardRenderer to get framed card
            const cardRenderer = new CharacterCardRenderer();
            const cardImageData = await cardRenderer.generateCharacterCard(character);
            
            let image;
            if (cardImageData) {
                if (Buffer.isBuffer(cardImageData)) {
                    // Convert buffer to data URL
                    const base64 = cardImageData.toString('base64');
                    image = await loadImage(`data:image/png;base64,${base64}`);
                } else if (typeof cardImageData === 'string' && cardImageData.startsWith('data:image/')) {
                    // Already a data URL
                    image = await loadImage(cardImageData);
                } else {
                    // URL or path
                    image = await loadImage(cardImageData);
                }
                
                // Draw the framed character card directly
                ctx.drawImage(image, x, y, this.cardWidth, this.cardHeight);
                return;
            }
        } catch (error) {
            console.log('Error using CharacterCardRenderer:', error.message);
        }

        // Fallback to basic card drawing
        await this.drawBasicCharacterCard(ctx, character, x, y, cardNumber);
    }

    /**
     * Draw a basic character card without frames (fallback)
     */
    async drawBasicCharacterCard(ctx, character, x, y, cardNumber) {
        // Draw card background/frame
        this.roundedRect(ctx, x, y, this.cardWidth, this.cardHeight, 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Subtle white background
        ctx.fill();

        // Card border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Subtle border
        ctx.lineWidth = 2;
        this.roundedRect(ctx, x, y, this.cardWidth, this.cardHeight, 8);
        ctx.stroke();

        try {
            // Get the ImageKit URL for the character
            const imageUrl = await this.getImageKitUrl(character);

            if (imageUrl) {
                let image;
                if (imageUrl.startsWith('data:image/')) {
                    // Handle base64 data URL from canvas
                    image = await loadImage(imageUrl);
                } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                    // Handle URL
                    image = await loadImage(imageUrl);
                } else {
                    // Handle local file path
                    const fs = require('fs');
                    const imageBuffer = fs.readFileSync(imageUrl);
                    image = await loadImage(imageBuffer);
                }

                // Draw the character image with slight padding
                const padding = 4;
                ctx.save();
                this.roundedRect(ctx, x + padding, y + padding, this.cardWidth - 2 * padding, this.cardHeight - 2 * padding, 6);
                ctx.clip();
                ctx.drawImage(image, x + padding, y + padding, this.cardWidth - 2 * padding, this.cardHeight - 2 * padding);
                ctx.restore();
            } else {
                // Fallback if no image URL available
                ctx.fillStyle = 'rgba(102, 102, 102, 0.8)';
                this.roundedRect(ctx, x + 4, y + 4, this.cardWidth - 8, this.cardHeight - 8, 6);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('No Image', x + this.cardWidth / 2, y + this.cardHeight / 2);
            }
        } catch (error) {
            console.error('Error loading character image:', error);
            // Fallback placeholder
            ctx.fillStyle = 'rgba(102, 102, 102, 0.8)';
            this.roundedRect(ctx, x + 4, y + 4, this.cardWidth - 8, this.cardHeight - 8, 6);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Error', x + this.cardWidth / 2, y + this.cardHeight / 2);
        }
    }

    /**
     * Get color based on rarity
     */
    getRarityColor(rarity) {
        const colors = {
            'COMMON': '#9CA3AF',
            'RARE': '#3B82F6',
            'EPIC': '#8B5CF6',
            'LEGENDARY': '#F59E0B',
            'MYTHIC': '#EF4444',
            'DIMENSIONAL': '#7C3AED',
            // Legacy lowercase support
            'Common': '#9CA3AF',
            'Uncommon': '#32CD32',
            'Rare': '#3B82F6',
            'Epic': '#8B5CF6',
            'Legendary': '#F59E0B',
            'Mythic': '#EF4444'
        };
        return colors[rarity] || colors['COMMON'];
    }

    /**
     * Draw a rounded rectangle using canvas
     */
    roundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    /**
     * Get ImageKit URL for character
     * @param {Object} character - Character object
     * @returns {string|null} ImageKit URL or null if not available
     */
    async getImageKitUrl(character) {
        const { IMAGE_KIT_BASE_URL } = require('../config/constants');

        // Check if ImageKit is available
        if (!(await this.isImageKitAvailable())) {
            return null; // Return null instead of fallback path
        }

        // Construct URL using character ID
        if (character.id) {
            return `${IMAGE_KIT_BASE_URL}Characters/${character.id}.png`;
        }

        return null;
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

module.exports = CardAlbum;
