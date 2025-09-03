/**
 * CardAlbum.js - Canvas-based character collection image generator
 * Generates beautiful character card albums for Discord using skia-canvas
 */

const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');
const CharacterImageManager = require('../components/builders/CharacterImageManager');

class CardAlbum {
    constructor() {
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.cardsPerPage = 8;
        this.cardWidth = 160;
        this.cardHeight = 200;
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

        // Add header
        this.drawHeader(ctx, user, page, characters.length);

        // Calculate pagination
        const startIndex = page * this.cardsPerPage;
        const endIndex = Math.min(startIndex + this.cardsPerPage, characters.length);
        const pageCharacters = characters.slice(startIndex, endIndex);

        // Draw character cards
        await this.drawCharacterCards(ctx, pageCharacters, startIndex);

        // Add pagination info
        this.drawPaginationInfo(ctx, page, Math.ceil(characters.length / this.cardsPerPage));

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
     * Draw the album header
     */
    drawHeader(ctx, user, page, totalCharacters) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';

        const headerText = user ? `${user.username}'s Collection` : 'Character Collection';
        ctx.fillText(headerText, this.canvasWidth / 2, 40);

        // Subtitle with collection stats
        ctx.font = '16px Arial';
        ctx.fillStyle = '#cccccc';
        const subtitle = `${totalCharacters} characters • Page ${page + 1}`;
        ctx.fillText(subtitle, this.canvasWidth / 2, 65);
    }

    /**
     * Draw character cards on the canvas
     */
    async drawCharacterCards(ctx, characters, startIndex) {
        const cardsPerRow = 4;
        const rows = 2;

        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;

            const x = this.margin + col * (this.cardWidth + this.cardSpacing);
            const y = 100 + row * (this.cardHeight + this.cardSpacing);

            await this.drawCharacterCard(ctx, character, x, y, startIndex + i + 1);
        }
    }

    /**
     * Draw a single character card
     */
    async drawCharacterCard(ctx, character, x, y, cardNumber) {
        // Card background with rounded corners
        this.roundedRect(ctx, x, y, this.cardWidth, this.cardHeight, 8);
        ctx.fillStyle = this.getRarityColor(character.rarity || 'Common');
        ctx.fill();

        // Card border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        this.roundedRect(ctx, x, y, this.cardWidth, this.cardHeight, 8);
        ctx.stroke();

        // Load and draw character image
        try {
            // Use CharacterImageManager to get the correct image based on current rarity
            const imageUrl = this.characterImageManager.getCharacterImageUrlByRarity(character);
            if (imageUrl) {
                const image = await loadImage(imageUrl);
                const imageSize = 120;
                const imageX = x + (this.cardWidth - imageSize) / 2;
                const imageY = y + 15;

                // Draw image with rounded corners
                ctx.save();
                this.roundedRect(ctx, imageX, imageY, imageSize, imageSize, 6);
                ctx.clip();
                ctx.drawImage(image, imageX, imageY, imageSize, imageSize);
                ctx.restore();
            } else {
                // Fallback if no image URL available
                ctx.fillStyle = '#666666';
                this.roundedRect(ctx, x + 20, y + 15, 120, 120, 6);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('No Image', x + this.cardWidth / 2, y + 75);
            }
        } catch (error) {
            console.error('Error loading character image:', error);
            // Fallback placeholder
            ctx.fillStyle = '#666666';
            this.roundedRect(ctx, x + 20, y + 15, 120, 120, 6);
            ctx.fill();
        }

        // Character name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        const nameY = y + this.cardHeight - 35;
        ctx.fillText(character.name || 'Unknown', x + this.cardWidth / 2, nameY);

        // Rarity badge
        ctx.font = '10px Arial';
        ctx.fillStyle = '#ffff00';
        const rarityY = y + this.cardHeight - 15;
        ctx.fillText(character.rarity || 'Common', x + this.cardWidth / 2, rarityY);

        // Card number
        ctx.fillStyle = '#cccccc';
        ctx.font = '8px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`#${cardNumber}`, x + 8, y + 15);
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
     * Draw pagination information
     */
    drawPaginationInfo(ctx, currentPage, totalPages) {
        ctx.fillStyle = '#888888';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const text = `Page ${currentPage + 1} of ${totalPages}`;
        ctx.fillText(text, this.canvasWidth / 2, this.canvasHeight - 20);
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
     * Get character image path
     * @param {Object} character - Character object
     * @returns {string} Full path to character image
     */
    getCharacterImagePath(character) {
        if (!character.imagePath) return null;

        // If it's already an absolute path, return it
        if (path.isAbsolute(character.imagePath)) {
            return character.imagePath;
        }

        // Otherwise, assume it's relative to the assets/images/characters directory
        return path.join(__dirname, '../assets/images/characters', character.imagePath);
    }
}

module.exports = CardAlbum;
