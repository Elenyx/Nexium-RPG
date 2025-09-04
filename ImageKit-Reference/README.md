# ImageKit Reference Structure

This folder shows the recommended structure for organizing character images on ImageKit.io for the rarity upgrade system.

## Folder Structure

```
ImageKit-Reference/
└── Characters/
    └── Naruto/
        ├── COMMON/
        │   ├── Naruto.png
        │   ├── Sasuke.png
        │   └── [other characters].png
        ├── RARE/
        │   ├── Naruto.png
        │   ├── Sasuke.png
        │   └── [other characters].png
        ├── EPIC/
        │   ├── Naruto.png
        │   ├── Sasuke.png
        │   └── [other characters].png
        ├── LEGENDARY/
        │   ├── Naruto.png
        │   ├── Sasuke.png
        │   └── [other characters].png
        ├── MYTHIC/
        │   ├── Naruto.png
        │   ├── Sasuke.png
        │   └── [other characters].png
        └── DIMENSIONAL/
            ├── Naruto.png
            ├── Sasuke.png
            └── [other characters].png
```

## URL Pattern

Each image should follow this URL pattern:

```
https://ik.imagekit.io/nexiumrpg/Characters/{Anime}/{Rarity}/{CharacterName}.png
```

### Examples

- `https://ik.imagekit.io/nexiumrpg/Characters/Naruto/COMMON/Naruto.png`
- `https://ik.imagekit.io/nexiumrpg/Characters/Naruto/RARE/Naruto.png`
- `https://ik.imagekit.io/nexiumrpg/Characters/Naruto/EPIC/Naruto.png`

## Design Guidelines

### COMMON Cards

- Basic design with gray/silver accents
- Simple frame
- "COMMON" text label

### RARE Cards

- Blue accents and effects
- Slightly enhanced frame
- "RARE" text label

### EPIC Cards

- Purple accents and effects
- More elaborate frame design
- "EPIC" text label

### LEGENDARY Cards

- Gold accents and effects
- Premium frame with special effects
- "LEGENDARY" text label

### MYTHIC Cards

- Red/pink accents and effects
- Advanced frame with animations
- "MYTHIC" text label

### DIMENSIONAL Cards

- Orange/teal accents and effects
- Ultimate frame design with special effects
- "DIMENSIONAL" text label

## Required Elements on Each Card

1. **Character Artwork**: High-quality character illustration
2. **Character Name**: Text label with character name
3. **Rarity Label**: Text showing the rarity tier
4. **Frame/Background**: Appropriate design for the rarity level
5. **Stats Display**: (Optional) Visual representation of stats

## File Naming Convention

- Use the character's actual name (not ID)
- Replace spaces with hyphens if needed
- Use PNG format for transparency support
- Keep filenames consistent across rarities

### Examples

- `Naruto.png` (not `naruto.png` or `NARUTO.PNG`)
- `Sasuke-Uchiha.png` (for names with spaces)
- `Kurama-Chakra-Mode.png` (for complex names)

## Upload Instructions

1. Create the folder structure on ImageKit.io
2. Upload character cards to their respective rarity folders
3. Ensure all 6 versions exist for each character
4. Test the URLs to make sure they load correctly
5. Update the character data files with the correct `imageUrls`

## Testing

After uploading, test with:

```
/rarity-progress [character_id]
/upgrade character_id:[character_id] type:rarity
```

The system will automatically display the correct rarity-specific card image.
