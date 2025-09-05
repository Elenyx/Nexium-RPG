module.exports = {
    COLORS: {
        PRIMARY: 0x7C3AED,
        SUCCESS: 0x10B981,
        WARNING: 0xF59E0B,
        ERROR: 0xEF4444,
        INFO: 0x3B82F6,
        COMMON: 0x9CA3AF,
        RARE: 0x3B82F6,
        EPIC: 0x8B5CF6,
        LEGENDARY: 0xF59E0B,
        MYTHIC: 0xEF4444,
        DIMENSIONAL: 0x7C3AED
    },

    EMOJIS: {
        DIMENSION: '🌌',
        ENERGY: '⚡',
        COIN: '🪙',
        LEVEL: '📈',
        EXP: '✨',
        STREAK: '🔥',
        SUMMON: '🎴',
        BATTLE: '⚔️',
        COLLECTION: '📚',
        SUCCESS: '✅',
        ERROR: '❌',
        WARNING: '⚠️',
        LOADING: '⏳',
        SHARD: '💎',
        GACHA: '🎲',
        QUEST: '📜',
        UPGRADE: '⬆️',
        INVENTORY: '🎒'
    },

    RARITIES: {
        COMMON: { chance: 0.477, multiplier: 1 },
        RARE: { chance: 0.302, multiplier: 2 },
        EPIC: { chance: 0.151, multiplier: 3 },
        LEGENDARY: { chance: 0.050, multiplier: 5 },
        MYTHIC: { chance: 0.020, multiplier: 10 },
        DIMENSIONAL: { chance: 0.000, multiplier: 20, eventOnly: true } // DIMENSIONAL characters are event-only
    },

    RARITY_UPGRADE_THRESHOLDS: {
        COMMON: 1000,      // Shards needed to upgrade from COMMON to RARE
        RARE: 2500,        // Shards needed to upgrade from RARE to EPIC
        EPIC: 0,           // No further upgrades for COMMON-EPIC group (switch to level system)
        LEGENDARY: 10000,  // Shards needed to upgrade from LEGENDARY to MYTHIC
        MYTHIC: 0,         // No further upgrades for LEGENDARY-MYTHIC group (switch to level system)
        DIMENSIONAL: 0     // Max tier, no further upgrades
    },

    RARITY_ORDER: ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIMENSIONAL'],

    // Rarity upgrade groups
    RARITY_GROUPS: {
        BASIC: ['COMMON', 'RARE', 'EPIC'],        // Upgrade to EPIC, then level system
        ADVANCED: ['LEGENDARY', 'MYTHIC']         // Upgrade to MYTHIC, then level system
    },

    // Level caps for different rarity groups
    LEVEL_CAPS: {
        BASIC_MAX_RARITY: 'EPIC',      // Max rarity for COMMON-EPIC group
        ADVANCED_MAX_RARITY: 'MYTHIC', // Max rarity for LEGENDARY-MYTHIC group
        BASIC_LEVEL_CAP: 100,          // Level cap after reaching EPIC
        ADVANCED_LEVEL_CAP: 100        // Level cap after reaching MYTHIC
    },

    // ImageKit.io Configuration for Character Images
    IMAGE_KIT_BASE_URL: 'https://ik.imagekit.io/NexiumRPG/',

    // Card and Frame Dimensions
    CARD_DIMENSIONS: {
        FRAME_WIDTH: 900,
        FRAME_HEIGHT: 1200,
        CHARACTER_AREA_WIDTH: 800,    // Character art width within frame
        CHARACTER_AREA_HEIGHT: 1000,  // Character art height within frame
        CHARACTER_OFFSET_X: 50,       // X offset from frame edge
        CHARACTER_OFFSET_Y: 100       // Y offset from frame edge
    },

    // Recommended Character Art Sizes
    CHARACTER_ART_SIZES: {
        STANDARD: { width: 800, height: 1000 },  // Fits perfectly in frame
        MINIMUM: { width: 400, height: 500 },    // Minimum recommended size
        MAXIMUM: { width: 1200, height: 1500 }   // Maximum recommended size
    },

    DIMENSIONS: {
        NEXUS_HUB: {
            name: 'Nexus Hub',
            description: 'The central hub connecting all dimensions',
            energyCost: 0
        },
        KONOHA: {
            name: 'Hidden Leaf Village',
            description: 'The world of Naruto',
            energyCost: 10
        },
        SOUL_SOCIETY: {
            name: 'Soul Society',
            description: 'The world of Bleach',
            energyCost: 15
        }
    },

    // Welcome System Configuration
    WELCOME_SYSTEM: {
        ENABLED: true,
        DEFAULT_MESSAGE: '🌟 Welcome **{user}** to **{guild}**! 🎉\n\nWe\'re excited to have you join our dimensional adventure!',
        BANNER_ENABLED: true,
        AUTO_WELCOME: true,
        // Channel names to look for (in order of priority)
        CHANNEL_NAMES: ['welcome', 'general', 'main', 'chat'],
        // Embed colors for different welcome types
        EMBED_COLORS: {
            WELCOME: 0x7C3AED,    // Primary purple
            JOIN: 0x10B981,       // Success green
            LEAVE: 0xEF4444       // Error red
        }
    },

    // Frame Configuration for Character Cards (Rarity-Based Frames)
    FRAMES: {
        // Default frame (no special styling)
        DEFAULT: {
            id: 'default',
            name: 'Default Frame',
            description: 'Standard character card frame',
            imageUrl: null, // No overlay needed
            obtainable: 'default' // Always available
        },

        // Rarity-based frames - automatically applied based on character rarity
        COMMON: {
            id: 'common',
            name: 'Common Frame',
            description: 'Standard frame for common rarity characters',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/COMMON.png',
            obtainable: 'rarity' // Automatically applied based on rarity
        },

        RARE: {
            id: 'rare',
            name: 'Rare Frame',
            description: 'Enhanced frame for rare rarity characters',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/RARE.png',
            obtainable: 'rarity' // Automatically applied based on rarity
        },

        EPIC: {
            id: 'epic',
            name: 'Epic Frame',
            description: 'Premium frame for epic rarity characters',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/EPIC.png',
            obtainable: 'rarity' // Automatically applied based on rarity
        },

        LEGENDARY: {
            id: 'legendary',
            name: 'Legendary Frame',
            description: 'Luxurious frame for legendary rarity characters',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/LEGENDARY.png',
            obtainable: 'rarity' // Automatically applied based on rarity
        },

        MYTHIC: {
            id: 'mythic',
            name: 'Mythic Frame',
            description: 'Mythical frame for mythic rarity characters',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/MYTHIC.png',
            obtainable: 'rarity' // Automatically applied based on rarity
        },

        DIMENSIONAL: {
            id: 'dimensional',
            name: 'Dimensional Frame',
            description: 'Transcendent frame for dimensional rarity characters',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/DIMENSIONAL.png',
            obtainable: 'rarity' // Automatically applied based on rarity
        },

        // Special frames - obtainable through events, seasonal, or special tasks
        GOLDEN_ANNIVERSARY: {
            id: 'golden_anniversary',
            name: 'Golden Anniversary Frame',
            description: 'Special golden frame celebrating milestones',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/GOLDEN_ANNIVERSARY.png',
            obtainable: 'event' // Special event frame
        },

        CHRISTMAS_FESTIVE: {
            id: 'christmas_festive',
            name: 'Festive Christmas Frame',
            description: 'Holiday-themed frame with festive decorations',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/CHRISTMAS_FESTIVE.png',
            obtainable: 'seasonal' // Seasonal event frame
        },

        HALLOWEEN_SPOOKY: {
            id: 'halloween_spooky',
            name: 'Spooky Halloween Frame',
            description: 'Eerie Halloween-themed frame with special effects',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/halloween_spooky.png',
            obtainable: 'seasonal' // Seasonal event frame
        },

        VALENTINES_ROMANTIC: {
            id: 'valentines_romantic',
            name: 'Romantic Valentine Frame',
            description: 'Heart-themed frame for Valentine\'s Day',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/valentines_romantic.png',
            obtainable: 'seasonal' // Seasonal event frame
        },

        SUMMER_VACATION: {
            id: 'summer_vacation',
            name: 'Summer Vacation Frame',
            description: 'Tropical frame for summer events',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/summer_vacation.png',
            obtainable: 'seasonal' // Seasonal event frame
        },

        NEW_YEAR_CELEBRATION: {
            id: 'new_year_celebration',
            name: 'New Year Celebration Frame',
            description: 'Festive frame for New Year celebrations',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/new_year_celebration.png',
            obtainable: 'seasonal' // Seasonal event frame
        },

        COMMUNITY_CHAMPION: {
            id: 'community_champion',
            name: 'Community Champion Frame',
            description: 'Exclusive frame for community champions',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/community_champion.png',
            obtainable: 'achievement' // Special achievement frame
        },

        BETA_TESTER: {
            id: 'beta_tester',
            name: 'Beta Tester Frame',
            description: 'Special frame for beta testers',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/beta_tester.png',
            obtainable: 'special' // Special recognition frame
        },

        EARLY_SUPPORTER: {
            id: 'early_supporter',
            name: 'Early Supporter Frame',
            description: 'Frame for early supporters of the project',
            imageUrl: 'https://ik.imagekit.io/NexiumRPG/frames/early_supporter.png',
            obtainable: 'special' // Special recognition frame
        }
    },

    // Frame IDs list for validation
    VALID_FRAME_IDS: ['default', 'common', 'rare', 'epic', 'legendary', 'mythic', 'dimensional', 'golden_anniversary', 'christmas_festive', 'halloween_spooky', 'valentines_romantic', 'summer_vacation', 'new_year_celebration', 'community_champion', 'beta_tester', 'early_supporter'],
};
