# Tests Directory

This folder contains all test files for the Nexium RPG Discord bot. Tests are organized here to keep the root directory clean and organized.

## Test Files

### `test-card-album.js`
**Purpose**: Tests the canvas-based character collection album generation functionality.

**What it tests**:
- CardAlbum class instantiation
- Image generation with sample character data
- Canvas rendering with character images, names, and rarity colors
- Output file generation (PNG format)

**How to run**:
```bash
node tests/test-card-album.js
```

**Expected output**: Generates `test-collection.png` in the tests folder with a sample character collection album.

### `test-character-collection.js`
**Purpose**: Tests the character collection Discord command functionality.

**What it tests**:
- Character data retrieval from database
- Collection command processing
- Image generation integration
- Error handling for empty collections

**How to run**:
```bash
node tests/test-character-collection.js
```

### `test-v2.js`
**Purpose**: Tests Discord Components V2 functionality.

**What it tests**:
- Modern Discord UI components
- Button interactions
- Component rendering
- Interaction handling

**How to run**:
```bash
node tests/test-v2.js
```

### `test-collection.png`
**Purpose**: Generated output file from `test-card-album.js`.

**Description**: Sample character collection album image showing the canvas rendering capabilities.

## Running All Tests

To run all tests in sequence:
```bash
# Run individual tests
node tests/test-card-album.js
node tests/test-character-collection.js
node tests/test-v2.js
```

## Test Dependencies

Make sure you have the following before running tests:
- Node.js installed
- All project dependencies installed (`npm install`)
- Database connection configured (for database-dependent tests)
- Character images in `src/assets/images/characters/` folder

## Adding New Tests

When adding new test files:
1. Place them in this `tests/` folder
2. Follow the naming convention: `test-[feature].js`
3. Add documentation to this README
4. Update any relevant documentation that references test files

## Notes

- Test files may generate output files (images, logs) in the tests folder
- Some tests require database connectivity
- Canvas tests require the `canvas` package to be installed
- Character images are required for visual tests
