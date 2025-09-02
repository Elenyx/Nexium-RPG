require('dotenv').config();
const { NexiumBot } = require('./bot');
const logger = require('./utils/logger');

const bot = new NexiumBot();

process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

bot.start();
