const legendaryCharacters = require('./characters');

module.exports = {
  characters: legendaryCharacters,
  rarity: 'LEGENDARY',
  total: legendaryCharacters.length
};
