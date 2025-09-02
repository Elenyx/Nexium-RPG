# Nexium RPG - GitHub Pages

This directory contains the GitHub Pages website for the Nexium RPG Discord bot.

## Setup

1. **Enable GitHub Pages**: Go to your repository settings and enable GitHub Pages
2. **Source**: Select "Deploy from a branch"
3. **Branch**: Select `main` and folder `/docs`
4. **Save**: GitHub will provide you with a URL (e.g., `https://elenyx.github.io/Nexium-RPG/`)

## Files

- `index.html` - Main website with black and purple theme
- `characters/` - Directory containing character images
- `.nojekyll` - Prevents Jekyll processing (important for proper asset serving)

## Character Images

Character images are served from the `characters/` directory. The bot's `CharacterImageManager.js` is configured to use these URLs:

```
https://elenyx.github.io/Nexium-RPG/characters/[filename]
```

## Customization

- **Theme**: Black and purple gradient theme
- **Responsive**: Mobile-friendly design
- **Interactive**: Hover effects and animations
- **Modern**: Uses CSS Grid and Flexbox

## Adding New Characters

1. Add the image file to `docs/characters/`
2. Update the `characterMap` in `src/components/builders/CharacterImageManager.js`
3. Commit and push changes
4. Images will be available via GitHub Pages URLs

## Features

- ✨ Beautiful black and purple theme
- 📱 Responsive design
- 🎨 Modern CSS with gradients and animations
- 🚀 Fast loading with optimized assets
- 🔗 Direct links to Discord bot invite
