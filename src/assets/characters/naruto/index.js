const common = require('./COMMON');
const rare = require('./RARE');
const epic = require('./EPIC');
const legendary = require('./LEGENDARY');
const mythic = require('./MYTHIC');
const dimensional = require('./DIMENSIONAL');

const allNarutoCharacters = [
  ...common.characters,
  ...rare.characters,
  ...epic.characters,
  ...legendary.characters,
  ...mythic.characters,
  ...dimensional.characters
];

module.exports = {
  common,
  rare,
  epic,
  legendary,
  mythic,
  dimensional,
  allCharacters: allNarutoCharacters,
  totalCharacters: allNarutoCharacters.length,
  anime: 'Naruto'
};