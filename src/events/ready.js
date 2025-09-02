/**
 * @file Ready Event Handler (ready.js)
 * @description This event triggers when the Discord client is fully connected and ready.
 * It's responsible for logging startup information, initializing state managers,
 * setting the bot's dynamic presence, starting background services, and reporting system diagnostics.
 * @author Nexium Bot Development Team
 */

const { Events, ActivityType, Collection, version: djsVersion } = require('discord.js');
const os = require('os');
const logger = require('../utils/logger');
const { startEnergyRegeneration } = require('../services/EnergyService');

module.exports = {
    // The 'name' property uses the Events enum for type safety and clarity.
    name: Events.ClientReady,
    // The 'once' property ensures this event only runs once per bot session.
    once: true,

    /**
     * The main execution function for the ClientReady event.
     * @param {import('discord.js').Client} client The Discord client instance.
     */
    async execute(client) {
        // --- 1. Pre-Execution Checks & Login Confirmation ---
        if (!client.user) {
            logger.error('Client user is not available. Aborting ready sequence.');
            return;
        }
        logger.info(`✅ Logged in as ${client.user.tag} (${client.user.id})`);
        console.log('--------------------------------------------------------------');

        // --- 2. Initialize State Managers & Services ---
        logger.info('Initializing state managers...');
        // Using Maps attached to the client instance for scalable session management.
        // This prepares for future systems like combat, trading, etc.
        client.activeTrades = new Map();
        client.activeBattles = new Map();
        client.activeDungeons = new Map();
        logger.info('State managers initialized successfully.');

        logger.info('Starting background services...');
        // This function starts the energy regeneration loop as planned in the development timeline.
        startEnergyRegeneration(client);
        logger.info('Energy regeneration service is now active.');
        console.log('--------------------------------------------------------------');
        
        // --- 3. Set Dynamic Bot Presence ---
        logger.info('Setting up dynamic bot presence...');
        const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);

        const activities = [
            { name: 'the multiverse | /help', type: ActivityType.Watching },
            { name: `with ${totalUsers.toLocaleString()} travelers`, type: ActivityType.Playing },
            { name: `across ${client.guilds.cache.size} dimensions`, type: ActivityType.Listening },
            { name: 'for /summon commands', type: ActivityType.Watching },
        ];

        // Set initial activity
        try {
            client.user.setActivity(activities[0].name, { type: activities[0].type });
        } catch (error) {
            logger.warn(`Unable to set initial activity: ${error.message}`);
        }

        // Rotate activity every 5 minutes (300,000 milliseconds).
        let activityIndex = 0;
        setInterval(() => {
            activityIndex = (activityIndex + 1) % activities.length;
            const newActivity = activities[activityIndex];
            // Update user count dynamically in the activity string
            if (newActivity.name.includes('travelers')) {
                const currentTotalUsers = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);
                newActivity.name = `with ${currentTotalUsers.toLocaleString()} travelers`;
            }
            try {
                client.user.setActivity(newActivity.name, { type: newActivity.type });
            } catch (error) {
                logger.warn(`Unable to rotate activity: ${error.message}`);
            }
        }, 300000);

        logger.info('Bot presence and activity rotation are now active.');
        console.log('--------------------------------------------------------------');

        // --- 4. Log Bot & System Statistics ---
        logger.info('Gathering bot and system statistics...');
        console.log(`
        📊 BOT STATISTICS:
           - Guilds: ${client.guilds.cache.size}
           - Users: ${totalUsers.toLocaleString()}
           - Channels: ${client.channels.cache.size}
           - Commands Loaded: ${client.commands?.size || 0}

        💻 SYSTEM INFORMATION:
           - Platform: ${os.type()} ${os.release()}
           - Node.js Version: ${process.version}
           - Discord.js Version: v${djsVersion}
           - Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
        `);
        console.log('--------------------------------------------------------------');

        // --- 5. Finalization ---
        logger.info('🚀 Nexium Bot is fully operational and observing the multiverse!');
    },
};
