/**
 * Sample character data for testing the character collection system
 * @file SampleCharacters.js
 * @description Contains sample character data with image references for testing
 */

const sampleCharacters = [
    {
        id: 'char_001',
        name: 'Naruto Uzumaki',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        level: 50,
        exp: 12500,
        attack: 85,
        defense: 70,
        speed: 90,
        health: 100,
        abilities: ['Rasengan', 'Shadow Clone Jutsu', 'Nine-Tails Chakra'],
        description: 'The hyperactive ninja who dreams of becoming Hokage.',
        imageUrl: 'https://i.imgur.com/8jJfZ9h.jpg', // Naruto placeholder
        imagePath: 'src/assets/images/characters/naruto.jpg'
    },
    {
        id: 'char_002',
        name: 'Sasuke Uchiha',
        anime: 'Naruto',
        rarity: 'LEGENDARY',
        level: 48,
        exp: 11800,
        attack: 88,
        defense: 75,
        speed: 85,
        health: 95,
        abilities: ['Chidori', 'Sharingan', 'Rinnegan'],
        description: 'The brooding avenger seeking power to defeat his brother.',
        imageUrl: 'https://i.imgur.com/Q3Z3Z3Z.jpg', // Sasuke placeholder
        imagePath: 'src/assets/images/characters/sasuke.png'
    },
    {
        id: 'char_003',
        name: 'Monkey D. Luffy',
        anime: 'One Piece',
        rarity: 'MYTHIC',
        level: 45,
        exp: 10500,
        attack: 92,
        defense: 80,
        speed: 88,
        health: 110,
        abilities: ['Gum-Gum Pistol', 'Gear Second', 'Gear Third'],
        description: 'The rubber-powered pirate captain with dreams of finding the One Piece.',
        imageUrl: 'https://i.imgur.com/4Z4Z4Z4.jpg', // Luffy placeholder
        imagePath: 'src/assets/images/characters/luffy.png'
    },
    {
        id: 'char_004',
        name: 'Edward Elric',
        anime: 'Fullmetal Alchemist',
        rarity: 'EPIC',
        level: 42,
        exp: 9200,
        attack: 78,
        defense: 72,
        speed: 75,
        health: 90,
        abilities: ['Alchemy', 'Automail Arm', 'Philosopher\'s Stone'],
        description: 'The young alchemist seeking to restore his brother\'s body.',
        imageUrl: 'https://i.imgur.com/5Z5Z5Z5.jpg', // Edward placeholder
        imagePath: 'src/assets/images/characters/edward.png'
    },
    {
        id: 'char_005',
        name: 'Goku',
        anime: 'Dragon Ball',
        rarity: 'DIMENSIONAL',
        level: 60,
        exp: 18000,
        attack: 95,
        defense: 85,
        speed: 95,
        health: 120,
        abilities: ['Kamehameha', 'Spirit Bomb', 'Super Saiyan'],
        description: 'The legendary Saiyan warrior who protects Earth.',
        imageUrl: 'https://i.imgur.com/6Z6Z6Z6.jpg', // Goku placeholder
        imagePath: 'src/assets/images/characters/goku.png'
    },
    {
        id: 'char_006',
        name: 'Light Yagami',
        anime: 'Death Note',
        rarity: 'RARE',
        level: 35,
        exp: 6800,
        attack: 65,
        defense: 55,
        speed: 70,
        health: 80,
        abilities: ['Death Note', 'Intelligence', 'Strategic Mind'],
        description: 'The brilliant student who discovers a notebook that can kill people.',
        imageUrl: 'https://i.imgur.com/7Z7Z7Z7.jpg', // Light placeholder
        imagePath: 'src/assets/images/characters/light.png'
    },
    {
        id: 'char_007',
        name: 'Tanjiro Kamado',
        anime: 'Demon Slayer',
        rarity: 'COMMON',
        level: 28,
        exp: 4200,
        attack: 60,
        defense: 65,
        speed: 75,
        health: 85,
        abilities: ['Water Breathing', 'Nichirin Sword', 'Sense of Smell'],
        description: 'The kind-hearted boy who becomes a demon slayer to save his sister.',
        imageUrl: 'https://example.com/tanjiro.jpg', // Placeholder URL
        imagePath: 'src/assets/images/characters/tanjiro.png'
    }
];

module.exports = sampleCharacters;
