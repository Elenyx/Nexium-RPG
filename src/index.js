require('dotenv').config();

// Apply Discord Components V2 patch BEFORE loading any other modules
const { applyDiscordComponentsV2Patch } = require('./utils/ComponentsV2Patch');
applyDiscordComponentsV2Patch();

const { NexiumBot } = require('./bot');
const logger = require('./utils/logger');

const bot = new NexiumBot();

process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

bot.start();
