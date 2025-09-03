const epicCharacters = require('./characters');

module.exports = {
  characters: epicCharacters,
  rarity: 'EPIC',
  total: epicCharacters.length
};
