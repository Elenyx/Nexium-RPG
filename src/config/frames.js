/**
 * Frames Configuration
 * Centralized management of all available character card frames
 * Supports both relative paths (combined with base URL) and full ImageKit URLs
 */

const frames = {
    // Default frame (no special styling)
    DEFAULT: {
        id: 'default',
        name: 'Default Frame',
        description: 'Standard character card frame',
        imageUrl: null, // No overlay needed
        obtainable: 'default', // Always available
        rarity: 'default'
    },

    // Option 1: Relative paths (recommended - combined with base URL)
    BASIC_GOLD: {
        id: 'basic_gold',
        name: 'Golden Frame',
        description: 'Elegant gold border frame overlay',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/Dimensional_01.png', // Full URL for separated system
        obtainable: 'event',
        rarity: 'common'
    },

    // Option 2: Full ImageKit URLs (alternative - shows flexibility)
    BASIC_SILVER: {
        id: 'basic_silver',
        name: 'Silver Frame',
        description: 'Shiny silver border frame overlay',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/Legendary.png', // Full URL for separated system
        obtainable: 'task',
        rarity: 'common'
    },

    // Premium frames - obtained through wins/achievements
    PREMIUM_DIAMOND: {
        id: 'premium_diamond',
        name: 'Diamond Frame',
        description: 'Luxurious diamond-encrusted frame overlay',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/Mythic.png', // Full URL for separated system
        obtainable: 'win',
        rarity: 'rare'
    },

    PREMIUM_PLATINUM: {
        id: 'premium_platinum',
        name: 'Platinum Frame',
        description: 'Premium platinum frame overlay with effects',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/Dimensional_-02.png', // Full URL for separated system
        obtainable: 'achievement',
        rarity: 'epic'
    },

    // Seasonal/Event frames - limited time availability
    SEASONAL_CHRISTMAS: {
        id: 'seasonal_christmas',
        name: 'Festive Christmas Frame',
        description: 'Holiday-themed frame overlay with snow effects',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/christmas_pattern.png', // Full URL for separated system
        obtainable: 'seasonal',
        rarity: 'legendary'
    },

    SEASONAL_HALLOWEEN: {
        id: 'seasonal_halloween',
        name: 'Spooky Halloween Frame',
        description: 'Halloween-themed frame overlay with special effects',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/halloween_pattern.png', // Full URL for separated system
        obtainable: 'seasonal',
        rarity: 'epic'
    },

    // Rarity-based frames for automatic application
    COMMON: {
        id: 'common',
        name: 'Common Frame',
        description: 'Standard frame for common rarity characters',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/common.png',
        obtainable: 'default',
        rarity: 'common'
    },

    RARE: {
        id: 'rare',
        name: 'Rare Frame',
        description: 'Enhanced frame for rare rarity characters',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/rare.png',
        obtainable: 'default',
        rarity: 'rare'
    },

    EPIC: {
        id: 'epic',
        name: 'Epic Frame',
        description: 'Premium frame for epic rarity characters',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/epic.png',
        obtainable: 'default',
        rarity: 'epic'
    },

    LEGENDARY: {
        id: 'legendary',
        name: 'Legendary Frame',
        description: 'Luxurious frame for legendary rarity characters',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/legendary.png',
        obtainable: 'default',
        rarity: 'legendary'
    },

    MYTHIC: {
        id: 'mythic',
        name: 'Mythic Frame',
        description: 'Mythical frame for mythic rarity characters',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/mythic.png',
        obtainable: 'default',
        rarity: 'mythic'
    },

    DIMENSIONAL: {
        id: 'dimensional',
        name: 'Dimensional Frame',
        description: 'Otherworldly frame for dimensional rarity characters',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/dimensional.png',
        obtainable: 'default',
        rarity: 'dimensional'
    }
};

// Frame IDs list for validation
const validFrameIds = Object.values(frames).map(frame => frame.id);

// Export frames and utilities
module.exports = {
    frames,
    validFrameIds,
    getFrameById: (id) => Object.values(frames).find(frame => frame.id === id),
    getFramesByObtainable: (method) => Object.values(frames).filter(frame => frame.obtainable === method),
    getFramesByRarity: (rarity) => Object.values(frames).filter(frame => frame.rarity === rarity)
};
