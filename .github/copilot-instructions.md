# Nexium RPG Discord Bot - AI Coding Guidelines

## Project Overview
Nexium is an anime-themed Discord RPG bot built with Discord.js v14, featuring character collection, battles, territories, and faction systems. The bot uses Components V2 for modern Discord UI interactions.

## Current Architecture
- **Framework**: Discord.js v14.22.1 with Components V2
- **Language**: JavaScript (CommonJS modules)
- **Configuration**: Environment variables via dotenv
- **Commands**: Slash command system with REST API deployment

## Essential Patterns & Conventions

### Discord.js Components V2 Usage
**Always include `MessageFlags.IsComponentsV2`** when sending messages with components:
```js
await channel.send({
  components: [component],
  flags: MessageFlags.IsComponentsV2,  // Required for V2
});
```

**Component limits**:
- Max 40 total components per message
- Max 4,000 characters across all TextDisplay components
- Files must be referenced via components, not attachments alone

### Component Builders
Use the appropriate builder classes for each component type:

**Text Display** (replaces message content):
```js
const { TextDisplayBuilder } = require('discord.js');
const textDisplay = new TextDisplayBuilder()
  .setContent('**Markdown** *supported*');
```

**Section** (groups components with optional accessories):
```js
const { SectionBuilder, ButtonStyle } = require('discord.js');
const section = new SectionBuilder()
  .addTextDisplayComponents(td => td.setContent('Content'))
  .setButtonAccessory(btn => btn
    .setCustomId('action')
    .setLabel('Click')
    .setStyle(ButtonStyle.Primary));
```

**Media Gallery** (grid of images/files):
```js
const { MediaGalleryBuilder } = require('discord.js');
const gallery = new MediaGalleryBuilder()
  .addItems(mg => mg
    .setDescription('Alt text')
    .setURL('attachment://image.png'));
```

### Interaction Handling
**Replace deprecated `ephemeral: true`** with:
```js
flags: MessageFlags.Ephemeral
```

**Handle component interactions**:
```js
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  const button = client.buttons.get(interaction.customId);
  if (!button) return;
  await button.execute(interaction);
});
```

**Use collectors for multi-step flows**:
```js
const collector = message.createMessageComponentCollector({
  componentType: ComponentType.Button,
  time: 15_000,
});
```

### Slash Commands
**Command registration pattern**:
```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('command')
    .setDescription('Description'),
  async execute(interaction) {
    // Handle command
  },
};
```

**Deploy commands** using REST API:
```js
const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(token);
await rest.put(Routes.applicationCommands(clientId), { body: commands });
```

## File Organization
- `index.js` - Main bot entry point and event handlers
- `deploy.js` - Slash command deployment script
- `AGENT.md` - Comprehensive Discord.js Components V2 guide
- `.env` - Environment configuration (token, database URLs)

## Development Workflow

### Environment Setup
1. Copy `.env.example` to `.env`
2. Add your Discord bot token and client ID
3. Run `npm install` to install dependencies

### Testing Commands
1. Modify commands array in `index.js` or `deploy.js`
2. Run `node deploy.js` to register commands
3. Run `node index.js` to start the bot
4. Test commands in Discord

### Adding New Features
1. **Commands**: Add to commands array and implement handler
2. **Components**: Create builder instances with proper customIds
3. **Events**: Add event listeners in `index.js`
4. **Interactions**: Handle in `interactionCreate` event

## Key Dependencies
- `discord.js`: ^14.22.1 - Core Discord API wrapper
- `dotenv`: ^17.2.1 - Environment variable management

## Planned Architecture (from README)
The project roadmap includes:
- PostgreSQL database integration
- Redis caching
- Modular command structure (`src/commands/`)
- Service layer pattern (`src/services/`)
- Component handlers (`src/components/`)
- Database models (`src/models/`)

## Common Pitfalls
- Forgetting `MessageFlags.IsComponentsV2` flag
- Using deprecated `ephemeral: true` instead of `flags: MessageFlags.Ephemeral`
- Not handling interaction timeouts (3-second limit)
- Mixing Components V1 and V2 in same message
- Exceeding component or character limits

## Code Style
- Use CommonJS `require()` syntax
- Async/await for Discord API calls
- Proper error handling for API failures
- Consistent naming: camelCase for variables, PascalCase for classes
- Include JSDoc comments for complex functions

## Testing
Currently uses basic console logging. Future integration planned with:
- Unit tests for command logic
- Integration tests for Discord interactions
- Mock Discord API for testing

## Deployment
- Environment variables for different stages
- REST API for command registration
- Process management (PM2 recommended for production)
- Docker support planned

## Resources
- [AGENT.md](D:\Nexium\Nexium-RPG\AGENT.md) - Detailed Components V2 guide
- [README.md](README.md) - Project overview and roadmap
- [Discord.js Guide](https://discordjs.guide/) - Official documentation
- [Discord Developer Portal](https://discord.com/developers/docs) - API reference</content>