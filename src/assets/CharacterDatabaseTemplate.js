/**
 * Character Database Template
 * @file CharacterDatabaseTemplate.js
 * @description Template showing character structure for different rarities
 */

const characterTemplates = {
    // LEGENDARY Characters (1% drop rate - Most powerful)
    LEGENDARY: {
        baseStats: { attack: 80-95, defense: 70-85, speed: 85-95, health: 95-110 },
        abilities: ['Ultimate Ability', 'Signature Technique', 'Special Power'],
        description: 'Legendary characters with exceptional power and unique abilities'
    },

    // MYTHIC Characters (3% drop rate - Very rare)
    MYTHIC: {
        baseStats: { attack: 75-90, defense: 65-80, speed: 80-90, health: 90-105 },
        abilities: ['Mythic Ability', 'Advanced Technique', 'Rare Power'],
        description: 'Mythic characters with extraordinary abilities and high stats'
    },

    // EPIC Characters (10% drop rate - Rare)
    EPIC: {
        baseStats: { attack: 65-80, defense: 60-75, speed: 70-85, health: 80-95 },
        abilities: ['Epic Ability', 'Special Technique', 'Enhanced Power'],
        description: 'Epic characters with impressive abilities and good stats'
    },

    // RARE Characters (25% drop rate - Uncommon)
    RARE: {
        baseStats: { attack: 55-70, defense: 50-65, speed: 60-75, health: 70-85 },
        abilities: ['Rare Ability', 'Technique', 'Power'],
        description: 'Rare characters with notable abilities and decent stats'
    },

    // COMMON Characters (61% drop rate - Common)
    COMMON: {
        baseStats: { attack: 45-60, defense: 40-55, speed: 50-65, health: 60-75 },
        abilities: ['Basic Ability', 'Technique', 'Power'],
        description: 'Common characters with standard abilities and base stats'
    }
};

/*
Example Character Structure:

{
    id: 'anime_character_001',           // Unique identifier (anime_shortname_character_001)
    name: 'Character Name',              // Full character name
    anime: 'Anime Series',               // Anime/manga source
    rarity: 'LEGENDARY',                 // COMMON, RARE, EPIC, MYTHIC, LEGENDARY
    baseStats: {
        level: 1,                        // Always start at level 1
        exp: 0,                          // Always start at 0 exp
        attack: 85,                      // Base attack stat (45-95 range)
        defense: 70,                     // Base defense stat (40-85 range)
        speed: 90,                       // Base speed stat (50-95 range)
        health: 100                      // Base health stat (60-110 range)
    },
    abilities: [                         // Array of 3 abilities
        'Primary Ability',
        'Secondary Ability',
        'Special Ability'
    ],
    description: 'Character backstory and personality description',
    imageUrl: 'https://ik.imagekit.io/nexium/characters/character-name.jpg',
    thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/character-name-thumb.jpg',
    element: 'Fire',                     // Fire, Water, Wind, Earth, Lightning, Light, Dark, None
    class: 'Warrior',                    // Warrior, Mage, Assassin, Tank, Support, etc.
    region: 'Location Name',             // Character's origin location
    quote: 'Famous quote from the character'
}

Image URL Structure:
- Main Image: https://ik.imagekit.io/nexium/characters/[character-name].jpg
- Thumbnail: https://ik.imagekit.io/nexium/thumbnails/[character-name]-thumb.jpg

Naming Convention for IDs:
- Use lowercase with underscores
- Format: [anime]_[character]_[number]
- Examples: naruto_uzumaki_001, one_piece_luffy_001, dragon_ball_goku_001
*/

module.exports = characterTemplates;
