# Character Database Setup Guide

## 📁 New Organized Character Database Structure

Your bot now uses a modular character database organized by anime series and power tiers:

```
src/assets/characters/
├── index.js                    # Main export file for all characters
└── naruto/                     # Anime series folder
    ├── index.js               # Naruto characters export
    ├── genin/                 # COMMON tier (genin.js)
    ├── chunin/                # RARE tier (chunin.js)
    ├── jonin/                 # EPIC tier (jonin.js)
    ├── kage/                  # LEGENDARY tier (kage.js)
    ├── ultimate/              # MYTHIC tier (ultimate.js)
    └── dimensional/           # DIMENSIONAL tier (dimensional.js)
```

## 🎯 Updated Rarity System & Drop Rates

| Rarity | Drop Rate | Base Stats Range | Naruto Rank | Description |
|--------|-----------|------------------|-------------|-------------|
| **DIMENSIONAL** | Event Only* | 91-96 ATK, 85-92 DEF, 88-95 SPD, 105-112 HP | Otsutsuki | God-like power |
| **MYTHIC** | 2% | 87-94 ATK, 78-87 DEF, 85-94 SPD, 98-107 HP | Ultimate Forms | Legendary transformations |
| **LEGENDARY** | 5% | 82-91 ATK, 75-84 DEF, 80-89 SPD, 92-101 HP | Kage Level | Village leaders |
| **EPIC** | 15.1% | 72-81 ATK, 65-74 DEF, 70-79 SPD, 82-91 HP | Jonin Level | Elite ninjas |
| **RARE** | 30.2% | 62-71 ATK, 55-64 DEF, 60-69 SPD, 72-81 HP | Chunin Level | Experienced ninjas |
| **COMMON** | 47.7% | 52-61 ATK, 45-54 DEF, 50-59 SPD, 62-71 HP | Genin Level | Entry-level ninjas |

*DIMENSIONAL characters are only obtainable through dimensional events, raid boss drops, or limited banners.

## 🏷️ Character ID System

Characters now use anime-specific prefixes:
- **Naruto**: `NU001`, `NU002`, etc.
- **Future**: `OP001` (One Piece), `DB001` (Dragon Ball), etc.

## 🖼️ Image Setup with ImageKit.io

### Required Image URLs:
- **Main Image**: `https://ik.imagekit.io/nexium/characters/[character-name].jpg`
- **Thumbnail**: `https://ik.imagekit.io/nexium/thumbnails/[character-name]-thumb.jpg`

### Image Requirements:
- **Main Image**: 400x560 pixels (card format)
- **Thumbnail**: 200x280 pixels (smaller preview)
- **Format**: JPG or PNG
- **Quality**: High quality, clear character artwork

## 📝 Updated Character Template Structure

```javascript
{
    id: 'NU001',                         // Anime prefix + sequential number (NU001, OP001, DB001, etc.)
    name: 'Naruto Uzumaki (Genin)',      // Full character name with form/variant
    anime: 'Naruto',                     // Source anime/manga
    rarity: 'COMMON',                    // COMMON, RARE, EPIC, LEGENDARY, MYTHIC, DIMENSIONAL
    baseStats: {
        level: 1,                        // Always 1
        exp: 0,                          // Always 0
        attack: 55,                      // 52-96 range based on rarity
        defense: 50,                     // 45-92 range based on rarity
        speed: 60,                       // 50-95 range based on rarity
        health: 65                       // 62-112 range based on rarity
    },
    abilities: [                         // 3-4 abilities based on character
        'Rasengan',
        'Shadow Clone Technique',
        'Nine-Tails Chakra'
    ],
    description: 'Young ninja with dreams of becoming Hokage. Determined and never gives up.',
    imageUrl: 'https://ik.imagekit.io/nexium/characters/naruto-uzumaki.jpg',
    thumbnailUrl: 'https://ik.imagekit.io/nexium/thumbnails/naruto-uzumaki-thumb.jpg',
    element: 'Wind',                     // Fire, Water, Wind, Earth, Lightning, None, etc.
    class: 'Ninja',                      // Ninja, Pirate, Saiyan, Alchemist, Demon Slayer, etc.
    region: 'Hidden Leaf Village',       // Character's origin location
    quote: 'Believe it!'                 // Famous quote or catchphrase
}
```

## 🔧 Updated Next Steps

1. **Upload Images**: Upload character images to your ImageKit.io account
2. **Add Characters**: Add new characters to appropriate tier files in `src/assets/characters/[anime]/[tier]/`
3. **Update Services**: Update gacha and character services to use `src/assets/characters/index.js`
4. **Test**: Test the `/pull` command to ensure characters load from new structure

## 📊 Current Naruto Characters (55 total)

### COMMON (Genin) - 5 characters
- NU001: Naruto Uzumaki (Genin)
- NU002: Sasuke Uchiha (Genin)
- NU003: Sakura Haruno (Genin)
- NU004: Kakashi Hatake (Genin days)
- NU005: Shikamaru Nara (Genin)

### RARE (Chunin) - 9 characters
- NU006-NU014: Various chunin-level characters

### EPIC (Jonin) - 11 characters
- NU015-NU025: Elite jonin and sannin

### LEGENDARY (Kage) - 14 characters
- NU026-NU039: Village leaders and legendary figures

### MYTHIC (Ultimate) - 9 characters
- NU040-NU048: Ultimate forms and transformations

### DIMENSIONAL (Otsutsuki) - 7 characters
- NU049-NU055: God-like characters and progenitors

## ⚠️ Important Notes

- Each character needs a **unique anime-prefixed ID** (NU001, OP001, DB001, etc.)
- Image URLs must be accessible and properly formatted on ImageKit.io
- Balance stats according to the updated rarity tiers (see table above)
- Keep descriptions concise but informative (2-3 sentences)
- Use consistent naming conventions for abilities and elements
- Organize characters by their actual power level in the source material

## 🎨 Updated Character ID Naming Convention

Format: `[AnimePrefix][SequentialNumber]`
Examples:
- **Naruto**: `NU001`, `NU002`, `NU003`, etc.
- **One Piece**: `OP001`, `OP002`, `OP003`, etc.
- **Dragon Ball**: `DB001`, `DB002`, `DB003`, etc.
- **Death Note**: `DN001`, `DN002`, `DN003`, etc.
- **Demon Slayer**: `DS001`, `DS002`, `DS003`, etc.

## 📂 File Organization Rules

- Place characters in the appropriate tier folder based on their power level
- Use the character's actual rank/title from the source material
- Maintain sequential numbering within each anime series
- Update the anime's index.js when adding new characters

Happy character creation! 🎮
