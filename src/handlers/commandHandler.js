const { readdirSync } = require('fs');
const { join } = require('path');
const logger = require('../utils/logger');

class CommandHandler {
    constructor(client) {
        this.client = client;
    }

    async loadCommands() {
        const commandsPath = join(__dirname, '../commands');
        const commandFolders = readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = join(commandsPath, folder);
            const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = join(folderPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    this.client.commands.set(command.data.name, command);
                    logger.info(`Loaded command: ${command.data.name}`);
                } else {
                    logger.warn(`Command at ${filePath} is missing required "data" or "execute" property.`);
                }
            }
        }
    }
}

module.exports = CommandHandler;
