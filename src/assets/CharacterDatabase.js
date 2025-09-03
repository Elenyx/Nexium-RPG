/**
 * Comprehensive Character Database for Nexium RPG
 * @file CharacterDatabase.js
 * @description Contains all available characters for the gacha system
 */

const characters = [
    // ===== LEGENDARY CHARACTERS (1% drop rate) =====
    {
        id: 'naruto_uzumaki_001',
        name: 'Naruto Uzumaki',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 85,
            defense: 70,
            speed: 90,
            health: 100
        },
        abilities: ['Rasengan', 'Shadow Clone Jutsu', 'Nine-Tails Chakra'],
        description: 'The hyperactive ninja who dreams of becoming Hokage. Known for his unwavering determination and belief in never giving up.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/naruto-uzumaki.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/naruto-uzumaki-thumb.jpg',
        element: 'Wind',
        class: 'Ninja',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not gonna run away, I never go back on my word! That\'s my nindo: my ninja way!'
    },

    // ===== MYTHIC CHARACTERS (3% drop rate) =====
    {
        id: 'one_piece_luffy_001',
        name: 'Monkey D. Luffy',
        anime: 'One Piece',
        rarity: 'MYTHIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 92,
            defense: 80,
            speed: 88,
            health: 110
        },
        abilities: ['Gum-Gum Pistol', 'Gear Second', 'Gear Third'],
        description: 'The rubber-powered pirate captain with dreams of finding the One Piece. His willpower and rubber body make him unstoppable.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/monkey-d-luffy.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/monkey-d-luffy-thumb.jpg',
        element: 'None',
        class: 'Pirate',
        region: 'East Blue',
        quote: 'I\'m gonna be King of the Pirates!'
    },

    // ===== EPIC CHARACTERS (10% drop rate) =====
    {
        id: 'dragon_ball_goku_001',
        name: 'Son Goku',
        anime: 'Dragon Ball',
        rarity: 'EPIC',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 88,
            defense: 75,
            speed: 95,
            health: 105
        },
        abilities: ['Kamehameha', 'Spirit Bomb', 'Super Saiyan'],
        description: 'The legendary Saiyan warrior who protects Earth. His love for fighting and pure heart make him a true hero.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/son-goku.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/son-goku-thumb.jpg',
        element: 'Ki',
        class: 'Martial Artist',
        region: 'Earth',
        quote: 'Kamehameha!'
    },

    // ===== RARE CHARACTERS (25% drop rate) =====
    {
        id: 'fullmetal_alchemist_edward_001',
        name: 'Edward Elric',
        anime: 'Fullmetal Alchemist',
        rarity: 'RARE',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 78,
            defense: 72,
            speed: 75,
            health: 90
        },
        abilities: ['Alchemy', 'Automail Arm', 'Philosopher\'s Stone'],
        description: 'The young alchemist seeking to restore his brother\'s body. His genius intellect and determination drive him forward.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/edward-elric.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/edward-elric-thumb.jpg',
        element: 'Alchemy',
        class: 'Alchemist',
        region: 'Amestris',
        quote: 'A lesson without pain is meaningless. That\'s because no one can gain without sacrificing something.'
    },

    // ===== COMMON CHARACTERS (61% drop rate) =====
    {
        id: 'demon_slayer_tanjiro_001',
        name: 'Tanjiro Kamado',
        anime: 'Demon Slayer',
        rarity: 'COMMON',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 65,
            defense: 68,
            speed: 75,
            health: 85
        },
        abilities: ['Water Breathing', 'Nichirin Sword', 'Sense of Smell'],
        description: 'The kind-hearted boy who becomes a demon slayer to save his sister. His compassion and swordsmanship grow stronger each day.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/tanjiro-kamado.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/tanjiro-kamado-thumb.jpg',
        element: 'Water',
        class: 'Demon Slayer',
        region: 'Japan',
        quote: 'I\'ll become a demon slayer to turn my sister back into a human!'
    }

    // ===== ADD YOUR CHARACTERS HERE =====
    // Follow the same structure for each new character
    // Make sure to use unique IDs and proper image URLs from imagekit.io
];

module.exports = characters;
