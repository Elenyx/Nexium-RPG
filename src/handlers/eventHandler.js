const { readdirSync } = require('fs');
const { join } = require('path');
const logger = require('../utils/logger');

class EventHandler {
    constructor(client) {
        this.client = client;
    }

    async loadEvents() {
        const eventsPath = join(__dirname, '../events');
        const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = join(eventsPath, file);
            const event = require(filePath);

            if (event.once) {
                this.client.once(event.name, (...args) => event.execute(...args));
            } else {
                this.client.on(event.name, (...args) => event.execute(...args));
            }

            logger.info(`Loaded event: ${event.name}`);
        }
    }
}

module.exports = EventHandler;
