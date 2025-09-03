/**
 * Naruto Characters Index
 * Exports all Naruto characters organized by tier
 */

const geninCharacters = require('./genin/genin');
const chuninCharacters = require('./chunin/chunin');
const joninCharacters = require('./jonin/jonin');
const kageCharacters = require('./kage/kage');
const ultimateCharacters = require('./ultimate/ultimate');
const dimensionalCharacters = require('./dimensional/dimensional');

// Combine all Naruto characters
const allNarutoCharacters = [
    ...geninCharacters,
    ...chuninCharacters,
    ...joninCharacters,
    ...kageCharacters,
    ...ultimateCharacters,
    ...dimensionalCharacters
];

// Export by tier
module.exports = {
    genin: geninCharacters,
    chunin: chuninCharacters,
    jonin: joninCharacters,
    kage: kageCharacters,
    ultimate: ultimateCharacters,
    dimensional: dimensionalCharacters,
    all: allNarutoCharacters
};
