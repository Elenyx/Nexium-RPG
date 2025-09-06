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
    },

    // Shop frames - available for purchase
    SHOP_FIRE: {
        id: 'shop_fire',
        name: 'Fire Frame',
        description: 'Fiery red frame with flame effects',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_fire.png',
        obtainable: 'shop',
        rarity: 'rare'
    },

    SHOP_ICE: {
        id: 'shop_ice',
        name: 'Ice Frame',
        description: 'Cool blue frame with frost patterns',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_ice.png',
        obtainable: 'shop',
        rarity: 'rare'
    },

    SHOP_NATURE: {
        id: 'shop_nature',
        name: 'Nature Frame',
        description: 'Green frame with leaf and vine motifs',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_nature.png',
        obtainable: 'shop',
        rarity: 'rare'
    },

    SHOP_ARCANE: {
        id: 'shop_arcane',
        name: 'Arcane Frame',
        description: 'Mystical purple frame with magical runes',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_arcane.png',
        obtainable: 'shop',
        rarity: 'rare'
    },

    SHOP_FUTURISTIC: {
        id: 'shop_futuristic',
        name: 'Futuristic Frame',
        description: 'High-tech frame with neon and circuit patterns',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_futuristic.png',
        obtainable: 'shop',
        rarity: 'epic'
    },

    SHOP_ANCIENT_RUINS: {
        id: 'shop_ancient_ruins',
        name: 'Ancient Ruins Frame',
        description: 'Stone frame with ancient ruins and mystical symbols',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/shop_ancient_ruins.png',
        obtainable: 'shop',
        rarity: 'epic'
    },

    // Premium shop frames - exclusive purchases
    PREMIUM_SHOP_CELESTIAL: {
        id: 'premium_celestial',
        name: 'Celestial Frame',
        description: 'Golden frame with stars and celestial bodies',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/premium_celestial.png',
        obtainable: 'premium_shop',
        rarity: 'legendary'
    },

    PREMIUM_SHOP_SHADOW: {
        id: 'premium_shadow',
        name: 'Shadow Frame',
        description: 'Dark frame with shadow effects and mysterious aura',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/premium_shadow.png',
        obtainable: 'premium_shop',
        rarity: 'legendary'
    },

    PREMIUM_SHOP_MECHANICAL: {
        id: 'premium_mechanical',
        name: 'Mechanical Frame',
        description: 'Steampunk frame with gears and mechanical components',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/premium_mechanical.png',
        obtainable: 'premium_shop',
        rarity: 'legendary'
    },

    PREMIUM_SHOP_OCEANIC: {
        id: 'premium_oceanic',
        name: 'Oceanic Frame',
        description: 'Deep blue frame with waves and sea creatures',
        imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/premium_oceanic.png',
        obtainable: 'premium_shop',
        rarity: 'legendary'
    }
};
const validFrameIds = Object.values(frames).map(frame => frame.id);

// Export frames and utilities
module.exports = {
    frames,
    validFrameIds,
    getFrameById: (id) => Object.values(frames).find(frame => frame.id === id),
    getFramesByObtainable: (method) => Object.values(frames).filter(frame => frame.obtainable === method),
    getFramesByRarity: (rarity) => Object.values(frames).filter(frame => frame.rarity === rarity)
};
