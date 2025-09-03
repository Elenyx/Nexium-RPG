# Character Database Setup Guide

## 📁 New Character Database Structure

Your bot now uses a comprehensive character database located at:
```
src/assets/CharacterDatabase.js
```

## 🎯 Rarity System & Drop Rates

| Rarity | Drop Rate | Base Stats Range | Description |
|--------|-----------|------------------|-------------|
| **LEGENDARY** | 1% | 80-95 ATK, 70-85 DEF, 85-95 SPD, 95-110 HP | Most powerful characters |
| **MYTHIC** | 3% | 75-90 ATK, 65-80 DEF, 80-90 SPD, 90-105 HP | Very rare characters |
| **EPIC** | 10% | 65-80 ATK, 60-75 DEF, 70-85 SPD, 80-95 HP | Rare characters |
| **RARE** | 25% | 55-70 ATK, 50-65 DEF, 60-75 SPD, 70-85 HP | Uncommon characters |
| **COMMON** | 61% | 45-60 ATK, 40-55 DEF, 50-65 SPD, 60-75 HP | Common characters |

## 🖼️ Image Setup with ImageKit.io

### Required Image URLs:
- **Main Image**: `https://ik.imagekit.io/nexium/characters/[character-name].jpg`
- **Thumbnail**: `https://ik.imagekit.io/nexium/thumbnails/[character-name]-thumb.jpg`

### Image Requirements:
- **Main Image**: 400x560 pixels (card format)
- **Thumbnail**: 200x280 pixels (smaller preview)
- **Format**: JPG or PNG
- **Quality**: High quality, clear character artwork

## 📝 Character Template Structure

```javascript
{
    id: 'anime_character_001',           // Unique ID (lowercase with underscores)
    name: 'Character Name',              // Full character name
    anime: 'Anime Series',               // Source anime/manga
    rarity: 'LEGENDARY',                 // COMMON, RARE, EPIC, MYTHIC, LEGENDARY
    baseStats: {
        level: 1,                        // Always 1
        exp: 0,                          // Always 0
        attack: 85,                      // 45-95 range based on rarity
        defense: 70,                     // 40-85 range based on rarity
        speed: 90,                       // 50-95 range based on rarity
        health: 100                      // 60-110 range based on rarity
    },
    abilities: [                         // Exactly 3 abilities
        'Primary Ability',
        'Secondary Ability',
        'Special Ability'
    ],
    description: 'Character backstory and personality (2-3 sentences)',
    imageUrl: 'https://ik.imagekit.io/nexium/characters/character-name.jpg',
    thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/character-name-thumb.jpg',
    element: 'Fire',                     // Fire, Water, Wind, Earth, Lightning, Light, Dark, Ki, None
    class: 'Warrior',                    // Warrior, Mage, Assassin, Tank, Support, Ninja, Pirate, etc.
    region: 'Location Name',             // Character's origin
    quote: 'Famous quote from the character'
}
```

## 🔧 Next Steps

1. **Upload Images**: Upload character images to your ImageKit.io account
2. **Add Characters**: Add new characters to `CharacterDatabase.js` following the template
3. **Update Services**: Make sure your gacha and character services use the new database
4. **Test**: Test the `/pull` command to ensure characters load properly

## 📊 Current Characters (5 examples provided)

- **Naruto Uzumaki** (LEGENDARY) - Naruto
- **Monkey D. Luffy** (MYTHIC) - One Piece
- **Son Goku** (EPIC) - Dragon Ball
- **Edward Elric** (RARE) - Fullmetal Alchemist
- **Tanjiro Kamado** (COMMON) - Demon Slayer

## ⚠️ Important Notes

- Each character needs a **unique ID**
- Image URLs must be accessible and properly formatted
- Balance stats according to rarity tiers
- Keep descriptions concise but informative
- Use consistent naming conventions

## 🎨 Character ID Naming Convention

Format: `[anime]_[character]_[number]`
Examples:
- `naruto_uzumaki_001`
- `one_piece_luffy_001`
- `dragon_ball_goku_001`
- `death_note_light_001`

Happy character creation! 🎮
