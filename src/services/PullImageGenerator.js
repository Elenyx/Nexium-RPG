/**
 * @file PullImageGenerator.js
 * @description Generates canvas images for gacha pull results
 * @author Nexium Bot Development Team
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');

class PullImageGenerator {
    constructor() {
        this.characterCache = new Map();
        this.registerFonts();
    }

    /**
     * Register custom fonts for the canvas
     */
    registerFonts() {
        try {
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
     * Load and cache character images.
     * @param {string} imageUrl - The full ImageKit URL (already transformed).
     * @returns {Promise<import('canvas').Image|null>} Canvas Image object or null on failure.
     */
    async loadCharacterImage(imageUrl) {
        if (!imageUrl) {
            console.warn('Load character image called with no URL.');
            return null;
        }

        if (this.characterCache.has(imageUrl)) {
            return this.characterCache.get(imageUrl);
        }

        try {
            const image = await loadImage(imageUrl);
            this.characterCache.set(imageUrl, image);
            return image;
        } catch (error) {
            console.warn(`Failed to load character image from URL: ${imageUrl}`, error.message);
            return null; // Return null instead of throwing
        }
    }
    
    /**
     * Generate a multi-character pull result image using framed URLs.
     * @param {Array} characters - Array of character objects, each with a pre-generated framed `image` URL.
     * @param {number} maxWidth - Maximum width of the result image.
     * @returns {Promise<Buffer>} PNG buffer of the pull results.
     */
    async generatePullResultsImage(characters, maxWidth = 1024) {
        if (!characters || characters.length === 0) {
            throw new Error('No characters provided to generate pull image.');
        }

        const cardWidth = 225;
        const cardHeight = 300;
        const padding = 20;
        const cardsPerRow = Math.min(characters.length, Math.floor((maxWidth - padding) / (cardWidth + padding)));
        const rows = Math.ceil(characters.length / cardsPerRow);
        const imageWidth = Math.min(maxWidth, cardsPerRow * (cardWidth + padding) + padding);
        const imageHeight = rows * (cardHeight + padding) + padding;

        const canvas = createCanvas(imageWidth, imageHeight);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, imageWidth, imageHeight);

        const promises = characters.map(async (character, i) => {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            const x = padding + col * (cardWidth + padding);
            const y = padding + row * (cardHeight + padding);

            // The character object should already have the transformed URL in its 'image' property
            const framedUrl = character.image;
            const cardImage = await this.loadCharacterImage(framedUrl);

            if (cardImage) {
                ctx.drawImage(cardImage, x, y, cardWidth, cardHeight);
            } else {
                // Draw a fallback card if the image failed to load
                const fallbackBuffer = this.generateFallbackCard(character, cardWidth, cardHeight);
                const fallbackImage = await loadImage(fallbackBuffer);
                ctx.drawImage(fallbackImage, x, y, cardWidth, cardHeight);
            }
        });

        await Promise.all(promises);
        return canvas.toBuffer('image/png');
    }

    /**
     * Generate a fallback card when an image is not available.
     * @param {Object} character - Character data.
     * @param {number} width - Card width.
     * @param {number} height - Card height.
     * @returns {Buffer} PNG buffer of the fallback card.
     */
    generateFallbackCard(character, width, height) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const rarityColors = {
            'COMMON': '#9CA3AF', 'RARE': '#3B82F6', 'EPIC': '#8B5CF6',
            'LEGENDARY': '#F59E0B', 'MYTHIC': '#EF4444', 'DIMENSIONAL': '#7C3AED'
        };
        ctx.fillStyle = rarityColors[character.rarity] || '#9CA3AF';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        const nameLines = character.name.split(' ');
        if (nameLines.length > 2) {
            ctx.strokeText(nameLines.slice(0, 2).join(' '), width / 2, height / 2 - 10);
            ctx.fillText(nameLines.slice(0, 2).join(' '), width / 2, height / 2 - 10);
            ctx.strokeText(nameLines.slice(2).join(' '), width / 2, height / 2 + 10);
            ctx.fillText(nameLines.slice(2).join(' '), width / 2, height / 2 + 10);
        } else {
            ctx.strokeText(character.name, width / 2, height / 2);
            ctx.fillText(character.name, width / 2, height / 2);
        }
        ctx.font = 'bold 12px Arial';
        ctx.strokeText(character.rarity, width / 2, height / 2 + 25);
        ctx.fillText(character.rarity, width / 2, height / 2 + 25);
        return canvas.toBuffer('image/png');
    }

    clearCache() {
        this.characterCache.clear();
    }
}

module.exports = PullImageGenerator;

