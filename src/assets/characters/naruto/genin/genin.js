/**
 * Naruto Genin Characters (COMMON tier)
 * ID Format: NU001, NU002, etc.
 */

const geninCharacters = [
    {
        id: 'NU001',
        name: 'Naruto Uzumaki (Genin)',
        anime: 'Naruto',
        rarity: 'COMMON',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 65,
            defense: 60,
            speed: 75,
            health: 80
        },
        abilities: ['Rasengan', 'Shadow Clone Jutsu', 'Nine-Tails Chakra'],
        description: 'The hyperactive ninja who dreams of becoming Hokage. Known for his unwavering determination and belief in never giving up.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/naruto-uzumaki-genin.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/naruto-uzumaki-genin-thumb.jpg',
        element: 'Wind',
        class: 'Ninja',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not gonna run away, I never go back on my word! That\'s my nindo: my ninja way!'
    },
    {
        id: 'NU002',
        name: 'Sasuke Uchiha (Genin)',
        anime: 'Naruto',
        rarity: 'COMMON',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 68,
            defense: 65,
            speed: 72,
            health: 78
        },
        abilities: ['Chidori', 'Sharingan', 'Fire Release'],
        description: 'The brooding avenger seeking power to defeat his brother. The last surviving member of the Uchiha clan.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/sasuke-uchiha-genin.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/sasuke-uchiha-genin-thumb.jpg',
        element: 'Fire',
        class: 'Uchiha',
        region: 'Hidden Leaf Village',
        quote: 'I will restore my clan... and kill a certain someone.'
    },
    {
        id: 'NU003',
        name: 'Sakura Haruno (Part 1)',
        anime: 'Naruto',
        rarity: 'COMMON',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 62,
            defense: 68,
            speed: 65,
            health: 82
        },
        abilities: ['Medical Ninjutsu', 'Strength', 'Chakra Control'],
        description: 'The intelligent and strong-willed kunoichi of Team 7. Aspiring medical ninja with incredible strength and determination.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/sakura-haruno-part1.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/sakura-haruno-part1-thumb.jpg',
        element: 'None',
        class: 'Medical Ninja',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not just a weak girl who needs protecting!'
    },
    {
        id: 'NU004',
        name: 'Shikamaru Nara (Chunin)',
        anime: 'Naruto',
        rarity: 'COMMON',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 60,
            defense: 58,
            speed: 64,
            health: 76
        },
        abilities: ['Shadow Possession', 'Strategic Mind', 'Ninja Tools'],
        description: 'The lazy genius of Team 10. Despite his reluctance to work hard, his tactical mind makes him exceptionally skilled.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/shikamaru-nara-chunin.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/shikamaru-nara-chunin-thumb.jpg',
        element: 'None',
        class: 'Strategist',
        region: 'Hidden Leaf Village',
        quote: 'What a drag...'
    },
    {
        id: 'NU005',
        name: 'Choji Akimichi (Standard)',
        anime: 'Naruto',
        rarity: 'COMMON',
        baseStats: {
            level: 1,
            exp: 0,
            attack: 66,
            defense: 70,
            speed: 58,
            health: 88
        },
        abilities: ['Expansion Jutsu', 'Butterfly Mode', 'Human Boulder'],
        description: 'The loyal member of Team 10 with a big appetite and even bigger heart. Master of expansion techniques.',
        imageUrl: 'https://ik.imagekit.io/nexium/characters/choji-akimichi-standard.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/choji-akimichi-standard-thumb.jpg',
        element: 'None',
        class: 'Akimichi',
        region: 'Hidden Leaf Village',
        quote: 'I\'m not fat... I\'m big-boned!'
    }
];

module.exports = geninCharacters;
