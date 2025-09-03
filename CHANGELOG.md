# Changelog

All notable changes to the Nexium RPG Discord Bot will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/SemVer).

## [1.1.0] - 2025-09-04

### Added
- **Two-Group Rarity Upgrade System**: Complete overhaul of character progression
  - **Basic Group**: Common → Rare → Epic progression with level system (1-100)
  - **Advanced Group**: Legendary → Mythic progression with level system (1-100)
  - **Balanced Design**: No upgrades beyond Epic/Mythic to prevent power creep
  - **Enhanced UI**: Clear messaging when max rarity reached, guides to level system
  - **Updated Commands**: `/rarity-progress` and `/upgrade` reflect new system
- **Level Cap System**: Group-specific level caps (100 levels for both groups)
  - Characters automatically transition to level system after max rarity
  - Consistent progression across all character rarities
  - Better long-term character development

### Changed
- **Rarity Upgrade Thresholds**: Updated for balanced progression
  - Common → Rare: 1,000 shards
  - Rare → Epic: 2,500 shards
  - Epic: 0 shards (max for basic group)
  - Legendary → Mythic: 10,000 shards
  - Mythic: 0 shards (max for advanced group)
- **Upgrade Command Logic**: Enhanced to handle group-specific caps and transitions
- **Progress Tracking**: Rarity progress shows group membership and next steps
- **Collection Display**: Fixed level display to use custom levels correctly

### Technical Details
- **Service Layer Updates**: `RarityUpgradeService.js` with group-based logic
- **Constants Reorganization**: New `RARITY_GROUPS` and `LEVEL_CAPS` configuration
- **Database Compatibility**: Existing user data preserved, new fields added
- **Backward Compatibility**: All existing characters work with new system

### Balance Improvements
- **Fair Progression**: Both groups have equal level caps (100)
- **Resource Management**: Shards used efficiently across rarity and level systems
- **Player Experience**: Clear guidance on upgrade paths and next steps
- **Game Balance**: Prevents overpowered characters while maintaining progression

---

## [Unreleased]
- **New Character Database Structure**: Complete reorganization of character system
  - Modular folder-based organization by anime series and power tiers
  - Naruto characters organized into 6 tiers: genin (COMMON), chunin (RARE), jonin (EPIC), kage (LEGENDARY), ultimate (MYTHIC), dimensional (DIMENSIONAL)
  - Anime-specific ID prefixes (NU001-NU055 for Naruto)
  - Centralized export system with `src/assets/characters/index.js`
- **55 Naruto Characters**: Comprehensive character collection across all rarity tiers
  - COMMON (5): Entry-level characters (Naruto, Sasuke, Sakura, etc.)
  - RARE (9): Chunin-level ninjas with moderate abilities
  - EPIC (11): Elite jonin and sannin-level characters
  - LEGENDARY (14): Kage-level and legendary figures (Tsunade, Orochimaru, etc.)
  - MYTHIC (9): Ultimate forms and transformations (Kurama Chakra Mode, etc.)
  - DIMENSIONAL (7): God-like characters (Kaguya, Hagoromo, Six Paths forms)
- **Updated Rarity System**: Enhanced with DIMENSIONAL tier and adjusted drop rates
  - DIMENSIONAL: 0.5% (91-96 ATK, 85-92 DEF, 88-95 SPD, 105-112 HP)
  - MYTHIC: 2% (87-94 ATK, 78-87 DEF, 85-94 SPD, 98-107 HP)
  - LEGENDARY: 5% (82-91 ATK, 75-84 DEF, 80-89 SPD, 92-101 HP)
  - EPIC: 15% (72-81 ATK, 65-74 DEF, 70-79 SPD, 82-91 HP)
  - RARE: 30% (62-71 ATK, 55-64 DEF, 60-69 SPD, 72-81 HP)
  - COMMON: 47.5% (52-61 ATK, 45-54 DEF, 50-59 SPD, 62-71 HP)

### Changed
- **Character Database Architecture**: Migrated from monolithic `CharacterDatabase.js` to modular structure
- **Image Management**: Switched from local image storage to ImageKit.io external hosting
- **Documentation**: Updated `CHARACTER_DATABASE_README.md` with new structure and guidelines
- **File Organization**: Clean separation of concerns with dedicated folders for each tier

### Removed
- **Obsolete Files**: Removed `CharacterDatabase.js` (1237 lines), `CharacterDatabaseTemplate.js`
- **Sample Data**: Removed deprecated `SampleCharacters_deprecated.js`
- **Local Images**: Removed local character images (edward.png, goku.png, light.png, luffy.png, naruto.jpg, sasuke.png, tanjiro.png)
- **Unused Folders**: Cleaned up `sample/` and `images/` directories

### Technical Details
- **File Structure**: `src/assets/characters/[anime]/[tier]/[tier].js`
- **ID System**: Anime prefixes (NU for Naruto, extensible for other series)
- **Export System**: Hierarchical exports from tier → anime → main index
- **Scalability**: Ready for additional anime series (One Piece, Dragon Ball, etc.)
- **Maintainability**: Clear organization makes adding new characters straightforward

### Performance Improvements
- **Reduced Bundle Size**: Removed 391 lines of obsolete code
- **Faster Loading**: Modular imports instead of single large file
- **Better Organization**: Logical grouping by power level and series

---

## [1.0.0] - 2025-09-03

### Added
- Initial Discord.js v14 bot setup with Components V2
- Basic slash command system
- Environment configuration with dotenv
- Project structure and documentation

### Dependencies
- discord.js: ^14.22.1
- dotenv: ^17.2.1

---

[Unreleased]: https://github.com/Elenyx/Nexium-RPG/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Elenyx/Nexium-RPG/releases/tag/v1.1.0
[1.0.0]: https://github.com/Elenyx/Nexium-RPG/releases/tag/v1.0.0</content>
<parameter name="filePath">d:\Nexium\Nexium-RPG\CHANGELOG.md
