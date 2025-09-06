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
     * Render a character card with a specific frame
     * @param {object} character - The character object
     * @param {string} frameId - Frame ID to apply (optional, defaults to rarity frame)
     * @returns {string} The complete ImageKit URL with transformations or base64 data URL
     */
    async renderCardWithFrame(character, frameId = null) {
        if (!character || !character.id || !character.rarity) {
            return this.generateSimpleCard(character || {});
        }

        // If no specific frame requested, use rarity frame
        if (!frameId || frameId === 'default') {
            return this.renderCardUrl(character);
        }

        // Check if ImageKit is available
        if (!(await this.isImageKitAvailable())) {
            return await this.createFramedImageWithCanvas(character, frameId);
        }

        // Construct the base image URL using character ID
        const baseImageUrl = `${IMAGE_KIT_BASE_URL}Characters/${character.id}.png`;

        // Get frame path
        const { frames } = require('../config/frames');
        const frameData = Object.values(frames).find(f => f.id === frameId);
        const framePath = frameData ? frameData.imageUrl : `frames/${character.rarity.toUpperCase()}.png`;

        // Remove base URL if present in frame path
        const cleanFramePath = framePath.replace(IMAGE_KIT_BASE_URL, '');

        // Construct the ImageKit URL with the overlay transformation
        const transformation = `tr=l-image,i-${cleanFramePath},l-end`;
        const finalUrl = `${baseImageUrl}?${transformation}`;

        return finalUrl;
    }

    /**
     * Generates a fully-formed ImageKit URL that overlays a rarity frame on a character's base image.
     * Falls back to canvas-generated framed images if ImageKit is unavailable.
     * @param {object} character - The character object from your database/assets.
     * @returns {string} The complete ImageKit URL with transformations or base64 data URL for canvas-generated image.
     */
    async renderCardUrl(character) {
        if (!character || !character.id || !character.rarity) {
            return this.generateSimpleCard(character || {});
        }

        // Check if ImageKit is available
        if (!(await this.isImageKitAvailable())) {
            return await this.createFramedImageWithCanvas(character);
        }

        // Construct the base image URL using character ID
        const baseImageUrl = `${IMAGE_KIT_BASE_URL}Characters/${character.id}.png`;

        // Define the path for the rarity frame
        const framePath = `frames/${character.rarity.toUpperCase()}.png`;

        // Construct the ImageKit URL with the overlay transformation
        const transformation = `tr=l-image,i-${framePath},l-end`;
        const finalUrl = `${baseImageUrl}?${transformation}`;

        return finalUrl;
    }

    /**
     * Check if ImageKit service is available
     * @returns {boolean} True if ImageKit is available, false otherwise
     */
    async isImageKitAvailable() {
        try {
            // Try to fetch a small test image to check if ImageKit is responding
            const testUrl = `${IMAGE_KIT_BASE_URL}Characters/test.png`;
            const response = await axios.head(testUrl, { timeout: 5000 });
            return response.status === 200;
        } catch (error) {
            console.log('ImageKit service unavailable, falling back to canvas rendering:', error.message);
            return false;
        }
    }

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
                    console.log('Attempting to load character image:', characterImageUrl);
                    const response = await axios.head(characterImageUrl, { timeout: 5000 });
                    if (response.status === 200) {
                        const characterImage = await loadImage(characterImageUrl);
                        if (characterImage) {
                            // Draw character image with some padding for frame
                            const padding = 20;
                            ctx.drawImage(characterImage, padding, padding, cardWidth - 2*padding, cardHeight - 2*padding);
                        }
                    } else {
                        console.log('Character image not found (status:', response.status, ') for character:', character.id);
                    }
                } catch (error) {
                    console.log('Could not load character image for canvas:', error.message, 'for character:', character.id);
                }
            }

            // Draw a simple frame border
            this.drawSimpleFrame(ctx, cardWidth, cardHeight, character.rarity);
            
            // Draw character info
            ctx.fillStyle = '#FFFFFF';
            try {
                ctx.font = 'bold 24px Arial';
            } catch (fontError) {
                console.log('Font loading error, using fallback:', fontError.message);
                ctx.font = 'bold 24px sans-serif';
            }
            ctx.textAlign = 'center';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            
            // Character name with outline
            ctx.strokeText(character.name, cardWidth/2, cardHeight - 60);
            ctx.fillText(character.name, cardWidth/2, cardHeight - 60);
            
            // Rarity text
            try {
                ctx.font = '18px Arial';
            } catch (fontError) {
                ctx.font = '18px sans-serif';
            }
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
     * Generate a comparison image showing current and new frame
     * @param {object} character - The character object
     * @param {string} currentFrameId - Current frame ID (or null for default rarity)
     * @param {string} newFrameId - New frame ID to preview
     * @returns {string} Base64 data URL of the comparison image
     */
    async generateFrameComparison(character, currentFrameId, newFrameId) {
        try {
            const canvas = createCanvas(900, 600); // Wider canvas for side-by-side
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, 900, 600);

            // Title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Frame Comparison', 450, 40);

            // Load character image
            let characterImage = null;
            try {
                const characterImageUrl = `${IMAGE_KIT_BASE_URL}Characters/${character.id}.png`;
                characterImage = await loadImage(characterImageUrl);
            } catch (error) {
                console.log('Could not load character image for comparison:', error.message);
            }

            // Generate current frame image
            const currentImage = await this.generateSingleFrameImage(character, currentFrameId, characterImage);
            const newImage = await this.generateSingleFrameImage(character, newFrameId, characterImage);

            // Draw current frame (left side)
            if (currentImage) {
                ctx.drawImage(currentImage, 50, 80, 350, 490);
            }

            // Draw new frame (right side)
            if (newImage) {
                ctx.drawImage(newImage, 500, 80, 350, 490);
            }

            // Labels
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';

            const currentLabel = currentFrameId ? this.getFrameName(currentFrameId) : `${character.rarity} Frame`;
            const newLabel = this.getFrameName(newFrameId);

            ctx.fillText(`Current: ${currentLabel}`, 225, 590);
            ctx.fillText(`New: ${newLabel}`, 675, 590);

            // Arrows
            ctx.fillStyle = '#00ff00';
            ctx.font = 'bold 48px Arial';
            ctx.fillText('→', 450, 300);

            return canvas.toDataURL('image/png');
        } catch (error) {
            console.warn('Failed to generate frame comparison:', error.message);
            return this.generateSimpleCard(character);
        }
    }

    /**
     * Generate a single frame image for comparison
     * @param {object} character - The character object
     * @param {string} frameId - Frame ID to apply
     * @param {Image} characterImage - Pre-loaded character image
     * @returns {Canvas} Canvas with framed image
     */
    async generateSingleFrameImage(character, frameId, characterImage) {
        const frameCanvas = createCanvas(400, 560);
        const ctx = frameCanvas.getContext('2d');

        // Background
        ctx.fillStyle = '#2C2F33';
        ctx.fillRect(0, 0, 400, 560);

        // Draw character image
        if (characterImage) {
            const padding = 20;
            ctx.drawImage(characterImage, padding, padding, 400 - 2*padding, 560 - 2*padding);
        }

        // Apply frame
        if (frameId && frameId !== 'default') {
            await this.applyFrameToCanvas(ctx, frameId, 400, 560);
        } else {
            // Default rarity frame
            this.drawSimpleFrame(ctx, 400, 560, character.rarity);
        }

        // Character info
        ctx.fillStyle = '#FFFFFF';
        try {
            ctx.font = 'bold 16px Arial';
        } catch (fontError) {
            ctx.font = 'bold 16px sans-serif';
        }
        ctx.textAlign = 'center';
        ctx.fillText(character.name, 200, 540);

        return frameCanvas;
    }

    /**
     * Apply a specific frame to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} frameId - Frame ID to apply
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    async applyFrameToCanvas(ctx, frameId, width, height) {
        try {
            const { frames } = require('../config/frames');
            const frameData = Object.values(frames).find(f => f.id === frameId);

            if (frameData && frameData.imageUrl) {
                let frameImage;
                if (frameData.imageUrl.startsWith('http')) {
                    frameImage = await loadImage(frameData.imageUrl);
                } else {
                    const framePath = `${IMAGE_KIT_BASE_URL}${frameData.imageUrl}`;
                    frameImage = await loadImage(framePath);
                }

                if (frameImage) {
                    ctx.drawImage(frameImage, 0, 0, width, height);
                }
            }
        } catch (error) {
            console.warn(`Failed to apply frame ${frameId}:`, error.message);
        }
    }

    /**
     * Get frame name from frame ID
     * @param {string} frameId - Frame ID
     * @returns {string} Frame name
     */
    getFrameName(frameId) {
        const { frames } = require('../config/frames');
        const frameData = Object.values(frames).find(f => f.id === frameId);
        return frameData ? frameData.name : frameId;
    }
}

module.exports = CharacterCardRenderer;

