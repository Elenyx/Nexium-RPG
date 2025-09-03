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
        UPGRADE: '⬆️'
    },

    RARITIES: {
        COMMON: { chance: 0.475, multiplier: 1 },
        RARE: { chance: 0.300, multiplier: 2 },
        EPIC: { chance: 0.150, multiplier: 3 },
        LEGENDARY: { chance: 0.050, multiplier: 5 },
        MYTHIC: { chance: 0.020, multiplier: 10 },
        DIMENSIONAL: { chance: 0.005, multiplier: 20 }
    },

    // ImageKit.io Configuration for Character Images
    IMAGE_KIT_BASE_URL: 'https://ik.imagekit.io/nexium/',

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
    }
};
