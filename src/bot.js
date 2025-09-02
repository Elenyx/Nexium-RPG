const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const { connectDatabase } = require('./database/connection');
const CommandHandler = require('./handlers/commandHandler');
const EventHandler = require('./handlers/eventHandler');
const ComponentHandler = require('./handlers/componentHandler');
const logger = require('./utils/logger');

class NexiumBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember
            ]
        });

        this.client.commands = new Collection();
        this.client.buttons = new Collection();
        this.client.modals = new Collection();
        this.client.selectMenus = new Collection();
        this.client.cooldowns = new Collection();
    }

    async start() {
        try {
            logger.info('🤖 Starting Nexium Discord Bot...');
            logger.info('Environment check:');
            logger.info('- DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? 'Set' : 'MISSING');
            logger.info('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'MISSING');
            logger.info('- NODE_ENV:', process.env.NODE_ENV || 'development');

            // Connect to database
            logger.info('📊 Connecting to database...');
            await connectDatabase();
            logger.info('✅ Database connected successfully');

            // Load handlers
            logger.info('⚙️ Loading handlers...');
            const commandHandler = new CommandHandler(this.client);
            const eventHandler = new EventHandler(this.client);
            const componentHandler = new ComponentHandler(this.client);

            await commandHandler.loadCommands();
            await eventHandler.loadEvents();
            await componentHandler.loadComponents();
            logger.info('✅ Handlers loaded successfully');

            // Login to Discord
            logger.info('🔐 Logging into Discord...');
            await this.client.login(process.env.DISCORD_TOKEN);
            logger.info('✅ Discord login successful');
        } catch (error) {
            logger.error('❌ Failed to start bot:', error);
            logger.error('Error details:', error.stack);
            process.exit(1);
        }
    }
}

module.exports = { NexiumBot };
