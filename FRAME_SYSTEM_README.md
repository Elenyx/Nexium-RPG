# Frame System Documentation

## Overview
The frame system allows users to customize their character cards with different visual **overlay frames** (skins). Frames are stored on ImageKit.io and applied as overlays via canvas rendering. Frames are **rarity-independent** and can be used on any character card.

## Frame Configuration

### Adding New Frames
To add a new frame, update the `FRAMES` object in `src/config/constants.js`:

```javascript
FRAMES: {
    YOUR_FRAME_ID: {
        id: 'your_frame_id',
        name: 'Your Frame Name',
        description: 'Description of the frame overlay',
        imageUrl: 'frames/your_frame.png', // Path relative to ImageKit base URL
        obtainable: 'event' // How the frame is obtained
    }
}
```

### Obtain Methods
- `default` - Always available (standard frame)
- `event` - Obtained through special events
- `task` - Obtained through completing tasks
- `win` - Obtained through winning competitions/battles
- `achievement` - Obtained through achievements
- `seasonal` - Limited time seasonal frames

### Character Art Sizing Guidelines

**Recommended Size**: 800 × 1000 pixels
- Fits perfectly within the 900 × 1200 frame
- Maintains aspect ratio and quality
- Automatic centering and scaling

**Supported Sizes**:
- **Minimum**: 400 × 500 pixels (will be upscaled)
- **Maximum**: 1200 × 1500 pixels (will be downscaled)
- **Any aspect ratio**: Automatically fitted and centered

**Canvas Processing**:
- Images are scaled to fit within 800×1000 area while maintaining aspect ratio
- Smaller images are upscaled with high-quality interpolation
- Larger images are downscaled proportionally
- All images are centered within the character area

### Frame ID Validation
- Add new frame IDs to `VALID_FRAME_IDS` array in constants
- The system automatically validates frame IDs in the `/skin` command

## Usage

### Command
```
/skin <character_id> <frame_id>
```

### Available Frames

- `default` - Standard character card frame (always available)
- `basic_gold` - Elegant gold border frame overlay (obtained through events)
- `basic_silver` - Shiny silver border frame overlay (obtained through tasks)
- `premium_diamond` - Diamond-encrusted frame overlay (obtained through wins)
- `premium_platinum` - Platinum frame overlay with effects (obtained through achievements)
- `seasonal_christmas` - Holiday-themed frame overlay (seasonal event)
- `seasonal_halloween` - Halloween-themed frame overlay (seasonal event)

## Technical Implementation

### Database
- Frame ID is stored in `UserCharacter.frameId` field
- Migration: `add-frame-id-migration.js`

### Services
- `FrameManager.js` - Handles frame operations and validation
- Integrates with ImageKit.io for frame image retrieval

### Canvas Integration
When implementing visual rendering:
1. Load character image from ImageKit
2. Load selected frame overlay image from ImageKit (if not default)
3. Composite frame overlay over character image
4. Apply any frame-specific effects or animations
5. Return the final composited image

## Future Enhancements
- Frame unlock requirements (premium currency, achievements)
- Animated frames
- User-customizable frame colors
- Frame combinations/effects
