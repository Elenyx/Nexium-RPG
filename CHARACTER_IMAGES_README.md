# Character Image Integration

This document explains how to use the character image system in the Nexium RPG bot.

## Overview

The character collection system now supports visual character images through the `CharacterImageManager` class. Images are automatically loaded and displayed in both modern and classic collection views.

## File Structure

```
src/
├── assets/
│   └── images/
│       └── characters/          # Character images stored here
│           ├── naruto.jpg
│           ├── sasuke.png
│           └── ...
├── components/
│   └── builders/
│       ├── CharacterCollection.js    # Main collection display
│       └── CharacterImageManager.js  # Image management
└── assets/
    └── sample/
        └── SampleCharacters.js       # Sample character data
```

## How It Works

### 1. Image Storage

Character images should be stored in `src/assets/images/characters/` with the following naming convention:
- Filename: `{characterId}.{extension}`
- Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

### 2. Character Data Structure

Each character object should include:
```javascript
{
    id: 'char_001',           // Unique character ID
    name: 'Naruto Uzumaki',
    imageUrl: 'https://...',  // Optional: External image URL as fallback
    imagePath: 'src/assets/images/characters/naruto.jpg'  // Optional: Local path
}
```

### 3. Automatic Image Loading

The system automatically:
1. Searches for images by character ID
2. Falls back to external URLs if local images aren't found
3. Creates Discord attachments for local images
4. Handles errors gracefully with placeholder emojis

## Usage Examples

### Basic Collection Display
```javascript
const CharacterCollection = require('./src/components/builders/CharacterCollection');

// Modern view with images
const collection = await CharacterCollection.createModernCollectionEmbed(
    characters,
    user,
    page,
    totalPages
);

// Classic view (fallback)
const classicCollection = await CharacterCollection.createAdaptiveCollection(
    characters,
    user,
    'classic',
    page,
    totalPages
);
```

### Character Detail View
```javascript
// Individual character display with image
const detail = await CharacterCollection.createCharacterDetailEmbed(
    character,
    user
);
```

### Manual Image Management
```javascript
const CharacterImageManager = require('./src/components/builders/CharacterImageManager');
const imageManager = new CharacterImageManager();

// Load character image
const imageResult = await imageManager.loadCharacterImage(character);
if (imageResult.success) {
    // Use imageResult.attachment and imageResult.filename
}

// Check if character has image
const hasImage = imageManager.hasCharacterImage(characterId);

// Get all available character images
const availableImages = imageManager.getAvailableCharacterImages();
```

## Testing

Run the test script to verify everything works:
```bash
node tests/test-character-collection.js
```

## Features

- ✅ Automatic image loading by character ID
- ✅ Support for multiple image formats
- ✅ Fallback to external URLs
- ✅ Error handling with graceful degradation
- ✅ Modern Components V2 integration
- ✅ Both classic embed and modern container views
- ✅ Async/await support throughout

## Adding Character Images

1. Place image files in `src/assets/images/characters/`
2. Name them using the character ID (e.g., `naruto.jpg`)
3. The system will automatically detect and use them
4. No code changes required!

## Troubleshooting

- **Images not loading**: Check file naming and ensure they're in the correct directory
- **Wrong image showing**: Verify character ID matches filename
- **Errors in console**: Check file permissions and supported formats
- **Test failures**: Ensure sample images exist or update test data

## Future Enhancements

- Image caching system
- Bulk image upload commands
- Image optimization and resizing
- CDN integration for production
- Image metadata storage in database
