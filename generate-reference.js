const characters = require('./src/assets/characters');
const fs = require('fs');

let content = '# Character Reference List\n\n';
content += 'Format: ID - Name (Rarity)\n\n';

characters.all.forEach(char => {
    content += `${char.id} - ${char.name} (${char.rarity})\n`;
});

fs.writeFileSync('character-reference.md', content);
console.log('Character reference file created: character-reference.md');
