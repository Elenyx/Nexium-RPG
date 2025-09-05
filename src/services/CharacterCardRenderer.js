/**
 * Character Card Renderer with Frame Overlay Support
 * Handles proper sizing and scaling for 900x1200 frame overlays
 */

const { createCanvas, loadImage } = require('canvas');
const FrameManager = require('../services/FrameManager');
const { CARD_DIMENSIONS } = require('../config/constants');

class CharacterCardRenderer {
    constructor() {
        this.frameManager = new FrameManager();

        // Standard frame dimensions from constants
        this.frameWidth = CARD_DIMENSIONS.FRAME_WIDTH;
        this.frameHeight = CARD_DIMENSIONS.FRAME_HEIGHT;

        // Character art sizing within frame
        this.characterArea = {
            width: CARD_DIMENSIONS.CHARACTER_AREA_WIDTH,
            height: CARD_DIMENSIONS.CHARACTER_AREA_HEIGHT,
            x: CARD_DIMENSIONS.CHARACTER_OFFSET_X,
            y: CARD_DIMENSIONS.CHARACTER_OFFSET_Y
        };

        // Image quality settings
        this.quality = {
            smoothing: true,
            imageSmoothingQuality: 'high'
        };
    }

    /**
     * Render character card with frame overlay
     * @param {string} characterId - Character ID
     * @param {string} frameId - Frame ID to apply
     * @returns {Buffer} PNG buffer of the rendered card
     */
    async renderCharacterCard(characterId, frameId) {
        const canvas = createCanvas(this.frameWidth, this.frameHeight);
        const ctx = canvas.getContext('2d');

        // Enable high-quality image rendering
        ctx.imageSmoothingEnabled = this.quality.smoothing;
        ctx.imageSmoothingQuality = this.quality.imageSmoothingQuality;

        try {
            // 1. Load character image
            const characterImageUrl = this.getCharacterImageUrl(characterId);
            const characterImage = await loadImage(characterImageUrl);

            // 2. Calculate scaling to fit character art in designated area
            const scale = this.calculateOptimalScale(
                characterImage.width,
                characterImage.height,
                this.characterArea.width,
                this.characterArea.height
            );

            const scaledWidth = characterImage.width * scale;
            const scaledHeight = characterImage.height * scale;

            // 3. Center the character art within the designated area
            const characterX = this.characterArea.x + (this.characterArea.width - scaledWidth) / 2;
            const characterY = this.characterArea.y + (this.characterArea.height - scaledHeight) / 2;

            // 4. Draw character image with proper scaling
            ctx.drawImage(
                characterImage,
                characterX,
                characterY,
                scaledWidth,
                scaledHeight
            );

            // 5. Load and apply frame overlay (if not default)
            if (frameId !== 'default') {
                const frameImageUrl = this.frameManager.getFrameImageUrl(frameId);
                if (frameImageUrl) {
                    const frameImage = await loadImage(frameImageUrl);
                    // Draw frame overlay at full frame size
                    ctx.drawImage(frameImage, 0, 0, this.frameWidth, this.frameHeight);
                }
            }

            // 6. Return the final composited image
            return canvas.toBuffer('image/png');

        } catch (error) {
            console.error('Error rendering character card:', error);
            throw error;
        }
    }

    /**
     * Calculate optimal scale to fit image within target dimensions while maintaining aspect ratio
     * @param {number} originalWidth - Original image width
     * @param {number} originalHeight - Original image height
     * @param {number} targetWidth - Target area width
     * @param {number} targetHeight - Target area height
     * @returns {number} Scale factor
     */
    calculateOptimalScale(originalWidth, originalHeight, targetWidth, targetHeight) {
        const scaleX = targetWidth / originalWidth;
        const scaleY = targetHeight / originalHeight;

        // Use the smaller scale to ensure image fits within bounds
        return Math.min(scaleX, scaleY);
    }

    /**
     * Get character image URL from ImageKit
     * @param {string} characterId - Character ID
     * @returns {string} Full ImageKit URL
     */
    getCharacterImageUrl(characterId) {
        // This would integrate with your existing character image system
        // Supports different sizes based on your character art dimensions
        return `https://ik.imagekit.io/NexiumRPG/characters/${characterId}.png`;
    }

    /**
     * Get character image with specific dimensions (for optimization)
     * @param {string} characterId - Character ID
     * @param {number} width - Desired width
     * @param {number} height - Desired height
     * @returns {string} ImageKit URL with transformations
     */
    getCharacterImageUrlWithSize(characterId, width, height) {
        // ImageKit URL with resize transformation
        const baseUrl = `https://ik.imagekit.io/NexiumRPG/characters/${characterId}.png`;
        return `${baseUrl}?tr=w-${width},h-${height},c-at_max`;
    }
}

module.exports = CharacterCardRenderer;
