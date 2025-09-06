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

            // If module exports an execute function, register it on client.buttons
            if (buttonModule && typeof buttonModule.execute === 'function') {
                const buttonName = file.replace('.js', '');
                this.client.buttons.set(buttonName, buttonModule);
                logger.info(`Registered client button handler: ${buttonName}`);
            } else if (buttonModule.prototype && buttonModule.prototype.execute) {
                const buttonName = file.replace('.js', '');
                this.client.buttons.set(buttonName, buttonModule);
                logger.info(`Registered client button handler (class): ${buttonName}`);
            } else {
                logger.info(`Loaded button module (not registered as client handler): ${file}`);
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
