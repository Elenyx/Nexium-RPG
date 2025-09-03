const rareCharacters = require('./characters');

module.exports = {
  characters: rareCharacters,
  rarity: 'RARE',
  total: rareCharacters.length
};
