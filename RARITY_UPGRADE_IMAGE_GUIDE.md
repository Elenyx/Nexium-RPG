# Character Image Structure for Rarity Upgrades

## Overview

For the rarity upgrade system to work properly with pre-designed character cards, you need to create separate image files for each rarity level of each character.

## ImageKit Folder Structure

```
Characters/
├── Naruto/
│   ├── COMMON/
│   │   ├── Naruto.png
│   │   └── Sasuke.png
│   ├── RARE/
│   │   ├── Naruto.png
│   │   └── Sasuke.png
│   ├── EPIC/
│   │   ├── Naruto.png
│   │   └── Sasuke.png
│   ├── LEGENDARY/
│   │   ├── Naruto.png
│   │   └── Sasuke.png
│   ├── MYTHIC/
│   │   ├── Naruto.png
│   │   └── Sasuke.png
│   └── DIMENSIONAL/
│       ├── Naruto.png
│       └── Sasuke.png
├── OnePiece/
│   ├── COMMON/
│   │   ├── Luffy.png
│   │   └── Zoro.png
│   ├── RARE/
│   │   ├── Luffy.png
│   │   └── Zoro.png
│   └── ...
└── ...
```

## Image URL Pattern

Each character should have URLs following this pattern:

```
https://ik.imagekit.io/NexiumRPG/Characters/{Anime}/{Rarity}/{CharacterName}.png
```

## Character Data Structure

Update your character data files to include `imageUrls` object:

```javascript
{
  id: 'NC001',
  name: 'Naruto Uzumaki',
  anime: 'Naruto',
  rarity: 'COMMON', // Initial rarity
  image: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/COMMON/Naruto.png',
  imageUrls: {
    COMMON: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/COMMON/Naruto.png',
    RARE: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/RARE/Naruto.png',
    EPIC: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/EPIC/Naruto.png',
    LEGENDARY: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/LEGENDARY/Naruto.png',
    MYTHIC: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/MYTHIC/Naruto.png',
    DIMENSIONAL: 'https://ik.imagekit.io/NexiumRPG/Characters/Naruto/DIMENSIONAL/Naruto.png'
  },
  // ... rest of character data
}
```

## Design Guidelines

### Card Design Elements

Each rarity level should have distinct visual elements:

- **COMMON**: Basic design, gray/silver accents
- **RARE**: Blue accents, slightly enhanced effects
- **EPIC**: Purple accents, more elaborate design
- **LEGENDARY**: Gold accents, premium effects
- **MYTHIC**: Red/pink accents, special effects
- **DIMENSIONAL**: Orange/teal accents, ultimate effects

### Required Elements on Each Card

- Character artwork
- Character name (text)
- Rarity label (text)
- Appropriate frame/colors for the rarity level

## Implementation Steps

1. **Create Image Folders**: Set up the folder structure on ImageKit
2. **Design Cards**: Create 6 versions of each character (one per rarity)
3. **Update Character Data**: Add `imageUrls` to all character files
4. **Test System**: Use `/rarity-progress` and `/upgrade` commands to verify

## Fallback System

If a rarity-specific image is missing, the system will:

1. Try to use the rarity-specific URL from `imageUrls`
2. Fall back to the single `imageUrl`
3. Use a colored placeholder if all else fails

This ensures the system continues working even if some images are missing.
