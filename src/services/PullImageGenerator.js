/**
 * @file PullImageGenerator.js
 * @description Generates canvas images for gacha pull results
 * @author Nexium Bot Development Team
 */

const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');
const { IMAGE_KIT_BASE_URL } = require('../config/constants');
const CharacterImageManager = require('../components/builders/CharacterImageManager');

class PullImageGenerator {
    constructor() {
        this.characterCache = new Map();
        this.characterImageManager = new CharacterImageManager();

        // Register fonts if available
        this.registerFonts();
    }

    /**
     * Register custom fonts for the canvas
     */
    registerFonts() {
        try {
            // Try to register some common fonts
            const fontPath = path.join(__dirname, '..', '..', 'assets', 'fonts');
            if (fs.existsSync(fontPath)) {
                const fontFiles = fs.readdirSync(fontPath).filter(file => file.endsWith('.ttf') || file.endsWith('.otf'));
                fontFiles.forEach(fontFile => {
                    const fontName = path.parse(fontFile).name;
                    registerFont(path.join(fontPath, fontFile), { family: fontName });
                });
            }
        } catch (error) {
            console.warn('Font registration failed:', error.message);
        }
    }

    /**
     * Load and cache character images
     * @param {string} imageUrl - Character image URL
     * @returns {Promise<Image>} Canvas Image object
     */
    async loadCharacterImage(imageUrl) {
        if (!imageUrl) {
            throw new Error('No image URL provided');
        }

        if (this.characterCache.has(imageUrl)) {
            return this.characterCache.get(imageUrl);
        }

        try {
            const image = await loadImage(imageUrl);
            this.characterCache.set(imageUrl, image);
            return image;
        } catch (error) {
            console.warn(`Failed to load character image: ${imageUrl}`, error.message);
            throw new Error(`Character image not available: ${imageUrl}`);
        }
    }

    /**
     * Generate a single character card with complete design (art + name)
     * @param {Object} character - Character data object with rarity and imageUrls
     * @param {number} width - Card width (default: 450)
     * @param {number} height - Card height (default: 600)
     * @returns {Promise<Buffer>} PNG buffer of the character card
     */
    async generateCharacterCard(character, width = 450, height = 600) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        try {
            // Get the correct image URL based on current rarity
            const imageUrl = this.characterImageManager.getCharacterImageUrlByRarity(character);
            const characterImage = await this.loadCharacterImage(imageUrl);

            // Draw the complete character card image
            ctx.drawImage(characterImage, 0, 0, width, height);

            return canvas.toBuffer('image/png');

        } catch (error) {
            console.error('Error generating character card:', error);

            // Generate fallback card
            return this.generateFallbackCard(character, width, height);
        }
    }

    /**
     * Generate a fallback card when images are not available
     * @param {Object} character - Character data
     * @param {number} width - Card width
     * @param {number} height - Card height
     * @returns {Buffer} PNG buffer of the fallback card
     */
    generateFallbackCard(character, width = 450, height = 600) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background color based on rarity
        const rarityColors = {
            'COMMON': '#9CA3AF',
            'RARE': '#3B82F6',
            'EPIC': '#8B5CF6',
            'LEGENDARY': '#F59E0B',
            'MYTHIC': '#EF4444',
            'DIMENSIONAL': '#7C3AED'
        };

        ctx.fillStyle = rarityColors[character.rarity] || '#9CA3AF';
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, width - 4, height - 4);

        // Character name
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.strokeText(character.name, width / 2, height / 2);
        ctx.fillText(character.name, width / 2, height / 2);

        // Rarity text
        ctx.font = 'bold 14px Arial';
        ctx.strokeText(character.rarity, width / 2, height / 2 + 25);
        ctx.fillText(character.rarity, width / 2, height / 2 + 25);

        return canvas.toBuffer('image/png');
    }

    /**
     * Generate a multi-character pull result image
     * @param {Array} characters - Array of character objects
     * @param {number} maxWidth - Maximum width of the result image
     * @returns {Promise<Buffer>} PNG buffer of the pull results
     */
    async generatePullResultsImage(characters, maxWidth = 1024) {
        if (!characters || characters.length === 0) {
            throw new Error('No characters provided');
        }

        // 3:4 aspect ratio cards - smaller size for grid layout
        const cardWidth = 225;
        const cardHeight = 300; // 225 * 4/3 = 300 exactly
        const padding = 20;
        const cardsPerRow = Math.min(characters.length, Math.floor((maxWidth - padding) / (cardWidth + padding)));

        const rows = Math.ceil(characters.length / cardsPerRow);
        const imageWidth = Math.min(maxWidth, cardsPerRow * (cardWidth + padding) + padding);
        const imageHeight = rows * (cardHeight + padding) + padding;

        const canvas = createCanvas(imageWidth, imageHeight);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, imageWidth, imageHeight);

        // Generate and place each character card
        for (let i = 0; i < characters.length; i++) {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;

            const x = padding + col * (cardWidth + padding);
            const y = padding + row * (cardHeight + padding);

            try {
                const cardBuffer = await this.generateCharacterCard(characters[i], cardWidth, cardHeight);
                const cardImage = await loadImage(cardBuffer);
                ctx.drawImage(cardImage, x, y, cardWidth, cardHeight);
            } catch (error) {
                console.error(`Failed to generate card for ${characters[i].name}:`, error);
                // Draw fallback
                ctx.fillStyle = '#666666';
                ctx.fillRect(x, y, cardWidth, cardHeight);
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Error', x + cardWidth / 2, y + cardHeight / 2);
            }
        }

        return canvas.toBuffer('image/png');
    }

    /**
     * Clear the image caches to free memory
     */
    clearCache() {
        this.characterCache.clear();
    }
}

module.exports = PullImageGenerator;
