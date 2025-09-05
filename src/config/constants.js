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
    }
};
