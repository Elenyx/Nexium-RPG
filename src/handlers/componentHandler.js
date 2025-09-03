const { readdirSync } = require('fs');
const { join } = require('path');
const logger = require('../utils/logger');

class ComponentHandler {
    constructor(client) {
        this.client = client;
    }

    async loadComponents() {
        // Load button handlers
        await this.loadButtonHandlers();
        // Load modal handlers
        await this.loadModalHandlers();
        // Load select menu handlers
        await this.loadSelectMenuHandlers();

        logger.info('Component handlers loaded successfully');
    }

    async loadButtonHandlers() {
        const buttonsPath = join(__dirname, '../components/buttons');
        const buttonFiles = readdirSync(buttonsPath).filter(file =>
            file.endsWith('.js') && file !== 'ButtonHandler.js'
        );

        for (const file of buttonFiles) {
            const filePath = join(buttonsPath, file);
            const buttonModule = require(filePath);

            // If it's a class with execute method, register it
            if (buttonModule.prototype && buttonModule.prototype.execute) {
                const buttonName = file.replace('.js', '');
                // Register individual button handlers
                // This is handled by the ButtonHandler class
                logger.info(`Loaded button handler module: ${buttonName}`);
            }
        }
    }

    async loadModalHandlers() {
        // TODO: Implement modal handler loading
        logger.info('Modal handlers loaded (placeholder)');
    }

    async loadSelectMenuHandlers() {
        // TODO: Implement select menu handler loading
        logger.info('Select menu handlers loaded (placeholder)');
    }
}

module.exports = ComponentHandler;
