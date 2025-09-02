const { Collection } = require('discord.js');
const logger = require('../../utils/logger');

class ButtonHandler {
    constructor(client) {
        this.client = client;
    }

    async handle(interaction) {
        if (!interaction.isButton()) return;

        const [category, action, ...params] = interaction.customId.split('_');

        try {
            // Check if button handler exists
            const handler = this.client.buttons.get(`${category}_${action}`);

            if (!handler) {
                logger.warn(`No handler found for button: ${interaction.customId}`);
                return interaction.reply({
                    content: 'This button is no longer active.',
                    ephemeral: true
                });
            }

            // Execute the button handler
            await handler.execute(interaction, params);

        } catch (error) {
            logger.error(`Button handling error: ${error}`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while processing this button.',
                    ephemeral: true
                });
            }
        }
    }
}

module.exports = ButtonHandler;
