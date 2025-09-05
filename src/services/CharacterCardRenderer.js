/**
 * Character Card Renderer with Frame Overlay Support
 * Handles proper sizing and scaling for 900x1200 frame overlays
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const fs = require('fs');
const FrameManager = require('../services/FrameManager');
const { CARD_DIMENSIONS } = require('../config/constants');
// Removed top-level models import to avoid initialization issues

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

        // Text rendering configuration
        this.textConfig = {
            fontSize: 32,
            fontFamily: 'Arial',
            color: '#FFFFFF',
            textColor: '#FFFFFF', // Added missing textColor
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 20,
            borderRadius: 15,
            textAlign: 'left', // Added missing textAlign
            textBaseline: 'middle', // Added missing textBaseline
            position: {
                x: 50,
                y: this.frameHeight - 80,
                width: this.frameWidth - 100,
                height: 60
            }
        };

        // Load fonts if available
        this.loadFonts();
    }

    /**
     * Load custom fonts for text rendering
     */
    loadFonts() {
        try {
            // Try to register some common fonts
            const fontPath = path.join(__dirname, '..', '..', 'assets', 'fonts');
            if (fs.existsSync(fontPath)) {
                const fontFiles = fs.readdirSync(fontPath).filter(file => file.endsWith('.ttf') || file.endsWith('.otf'));
                fontFiles.forEach(fontFile => {
                    const fontName = path.parse(fontFile).name;
                    registerFont(path.join(fontPath, fontFile), { family: fontName });
                    this.textConfig.fontFamily = fontName; // Use the first available font
                });
            }
        } catch (error) {
            console.warn('Font loading failed:', error.message);
        }
    }

    /**
     * Render character card with frame overlay and character name
     * @param {string} characterId - Character ID
     * @param {string} frameId - Frame ID to apply (optional, will use rarity-based if not provided)
     * @returns {Buffer} PNG buffer of the rendered card
     */
    async renderCharacterCard(characterId, frameId = null) {
        const canvas = createCanvas(this.frameWidth, this.frameHeight);
        const ctx = canvas.getContext('2d');

        // Enable high-quality image rendering
        ctx.imageSmoothingEnabled = this.quality.smoothing;
        ctx.imageSmoothingQuality = this.quality.imageSmoothingQuality;

        try {
            // 1. Get character data from assets first (primary source)
            let character = this.getCharacterDataFromAssets(characterId);
            
            // 2. If not found in assets, try database as fallback
            if (!character) {
                character = await this.getCharacterData(characterId);
                if (!character) {
                    throw new Error(`Character not found: ${characterId}`);
                }
            }

            // 3. Determine frame to use
            if (!frameId) {
                // Auto-select frame based on character rarity
                frameId = this.getRarityFrameId(character.rarity);
            }

            // 3. Load character image
            const characterImageUrl = this.getCharacterImageUrl(characterId, character);
            let characterImage;
            try {
                characterImage = await loadImage(characterImageUrl);
                console.log(`✅ Character image loaded: ${characterImageUrl}`);
            } catch (imageError) {
                console.error(`❌ Character image not available: ${characterImageUrl}`);
                throw new Error(`Character image not available: ${characterImageUrl}`);
            }

            // 3. Calculate scaling to fit character art in designated area
            const scale = this.calculateOptimalScale(
                characterImage.width,
                characterImage.height,
                this.characterArea.width,
                this.characterArea.height
            );

            const scaledWidth = characterImage.width * scale;
            const scaledHeight = characterImage.height * scale;

            // 4. Center the character art within the designated area
            const characterX = this.characterArea.x + (this.characterArea.width - scaledWidth) / 2;
            const characterY = this.characterArea.y + (this.characterArea.height - scaledHeight) / 2;

            // 5. Draw character image with proper scaling
            ctx.drawImage(
                characterImage,
                characterX,
                characterY,
                scaledWidth,
                scaledHeight
            );

            // 6. Load and apply frame overlay (if not default)
            if (frameId !== 'default') {
                const frameImageUrl = this.frameManager.getFrameImageUrl(frameId);
                if (frameImageUrl) {
                    try {
                        const frameImage = await loadImage(frameImageUrl);
                        // Draw frame overlay at full frame size
                        ctx.drawImage(frameImage, 0, 0, this.frameWidth, this.frameHeight);
                        console.log(`✅ Applied frame: ${frameId}`);
                    } catch (frameError) {
                        console.warn(`⚠️ Frame image not available: ${frameImageUrl}, rendering without frame`);
                        // Continue without frame - character will still be rendered
                    }
                }
            }

            // 7. Render character name with transparent background
            this.renderCharacterName(ctx, character);

            // 8. Return the final composited image
            return canvas.toBuffer('image/png');

        } catch (error) {
            console.error('Error rendering character card:', error);
            throw error;
        }
    }

    /**
     * Get character data from database
     * @param {string} characterId - Character ID
     * @returns {Object} Character data
     */
    async getCharacterData(characterId) {
        try {
            // Dynamically import models to ensure they're initialized
            const { models } = require('../database/connection');

            if (!models || !models.Character) {
                throw new Error('Database models not initialized');
            }
            const character = await models.Character.findByPk(characterId);
            return character ? character.toJSON() : null;
        } catch (error) {
            console.error('Error fetching character data:', error);
            throw error;
        }
    }

    /**
     * Render character name with transparent background and fade effect
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} character - Character data
     */
    renderCharacterName(ctx, character) {
        const name = character.name || 'Unknown Character';
        const textConfig = this.textConfig;

        // Set font
        ctx.font = `${textConfig.fontSize}px ${textConfig.fontFamily}`;
        ctx.textAlign = textConfig.textAlign;
        ctx.textBaseline = textConfig.textBaseline;

        // Measure text
        const textMetrics = ctx.measureText(name);
        const textWidth = textMetrics.width;
        const textHeight = textConfig.fontSize;

        // Calculate text position
        const textX = textConfig.position.x;
        const textY = textConfig.position.y;

        // Create gradient for fade effect
        const gradient = ctx.createLinearGradient(
            textX - textWidth / 2,
            textY - textHeight / 2,
            textX + textWidth / 2,
            textY + textHeight / 2
        );
        gradient.addColorStop(0, textConfig.backgroundColor);
        gradient.addColorStop(0.7, textConfig.backgroundColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade to transparent

        // Draw background rectangle with rounded corners
        const padding = textConfig.padding;
        const bgX = textX - textWidth / 2 - padding;
        const bgY = textY - textHeight / 2 - padding;
        const bgWidth = textWidth + padding * 2;
        const bgHeight = textHeight + padding * 2;

        // Draw rounded background
        ctx.fillStyle = gradient;
        this.roundedRect(ctx, bgX, bgY, bgWidth, bgHeight, textConfig.borderRadius);
        ctx.fill();

        // Draw text
        ctx.fillStyle = textConfig.textColor;
        ctx.fillText(name, textX, textY);
    }

    /**
     * Draw a rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} radius - Corner radius
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
     * Get character image URL (using asset URLs directly)
     * @param {string} characterId - Character ID
     * @param {Object} character - Character data from database
     * @returns {string} Character image URL
     */
    getCharacterImageUrl(characterId, character) {
        // Get character data from assets to use the pre-defined URLs
        const characterData = this.getCharacterDataFromAssets(characterId);
        if (characterData && characterData.image) {
            return characterData.image;
        }

        // Fallback: construct URL using database character data and rarity
        if (character && character.anime && character.rarity && character.name) {
            return `https://ik.imagekit.io/NexiumRPG/Characters/${character.anime}/${character.rarity}/${character.name.replace(/\s+/g, '')}.png`;
        }

        // Final fallback
        return `https://ik.imagekit.io/NexiumRPG/Characters/${characterId}.png`;
    }

    /**
     * Get character data from assets by character ID
     * @param {string} characterId - Character ID to look up
     * @returns {Object|null} Character data from assets or null if not found
     */
    getCharacterDataFromAssets(characterId) {
        try {
            // Load all characters from assets
            const { all: allCharacters } = require('../assets/characters');
            
            // Find the character by ID
            const character = allCharacters.find(char => char.id === characterId);
            
            return character || null;
        } catch (error) {
            console.warn('Error loading character data from assets:', error.message);
            return null;
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
     * Get the appropriate frame ID based on character rarity
     * @param {string} rarity - Character rarity
     * @returns {string} Frame ID to use
     */
    getRarityFrameId(rarity) {
        if (!rarity) return 'default';
        
        // Map rarity to frame ID (convert to lowercase)
        const rarityMap = {
            'COMMON': 'common',
            'RARE': 'rare',
            'EPIC': 'epic',
            'LEGENDARY': 'legendary',
            'MYTHIC': 'mythic',
            'DIMENSIONAL': 'dimensional'
        };
        
        return rarityMap[rarity.toUpperCase()] || 'default';
    }
}

module.exports = CharacterCardRenderer;
