const mythicCharacters = require('./characters');

module.exports = {
  characters: mythicCharacters,
  rarity: 'MYTHIC',
  total: mythicCharacters.length
};
