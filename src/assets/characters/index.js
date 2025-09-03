/**
 * Main Characters Index
 * Central export point for all characters across all anime series
 */

const narutoCharacters = require('./naruto');

// Combine all characters from all anime series
const allCharacters = [
    ...narutoCharacters.all
];

// Export by anime series
module.exports = {
    naruto: narutoCharacters,
    all: allCharacters
};
