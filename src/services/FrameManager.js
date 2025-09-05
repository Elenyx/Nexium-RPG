/**
 * Frame Manager Service
 * Manages character card frames for the skin system
 */

const { FRAMES, VALID_FRAME_IDS, IMAGE_KIT_BASE_URL } = require('../config/constants');

class FrameManager {
    constructor() {
        this.frames = FRAMES;
        this.validFrameIds = VALID_FRAME_IDS;
        this.baseUrl = IMAGE_KIT_BASE_URL;
    }

    /**
     * Get all available frames
     * @returns {Object} All frame configurations
     */
    getAllFrames() {
        return this.frames;
    }

    /**
     * Get a specific frame by ID
     * @param {string} frameId - Frame ID to retrieve
     * @returns {Object|null} Frame configuration or null if not found
     */
    getFrame(frameId) {
        const frameKey = Object.keys(this.frames).find(key => this.frames[key].id === frameId);
        return frameKey ? this.frames[frameKey] : null;
    }

    /**
     * Check if a frame ID is valid
     * @param {string} frameId - Frame ID to validate
     * @returns {boolean} True if frame ID is valid
     */
    isValidFrameId(frameId) {
        return this.validFrameIds.includes(frameId);
    }

    /**
     * Get the full ImageKit URL for a frame
     * @param {string} frameId - Frame ID
     * @returns {string|null} Full URL or null if frame not found
     */
    getFrameImageUrl(frameId) {
        const frame = this.getFrame(frameId);
        if (!frame || !frame.imageUrl) return null;

        return `${this.baseUrl}${frame.imageUrl}`;
    }

    /**
     * Get frames by obtain method
     * @param {string} obtainMethod - How the frame is obtained (event, task, win, achievement, seasonal)
     * @returns {Array} Array of frames matching the obtain method
     */
    getFramesByObtainMethod(obtainMethod) {
        return Object.values(this.frames).filter(frame => frame.obtainable === obtainMethod);
    }

    /**
     * Get all obtainable frames (excluding default)
     * @returns {Array} Array of all frames that can be obtained
     */
    getObtainableFrames() {
        return Object.values(this.frames).filter(frame => frame.obtainable !== 'default');
    }

    /**
     * Get frame options for Discord select menus
     * @returns {Array} Array of frame options for Discord components
     */
    getFrameOptions() {
        return Object.values(this.frames).map(frame => ({
            label: frame.name,
            value: frame.id,
            description: frame.description.substring(0, 50) // Discord limit
        }));
    }
}

module.exports = FrameManager;
