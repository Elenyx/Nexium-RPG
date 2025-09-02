const logger = require('../../utils/logger');

class ModalHandler {
    constructor(client) {
        this.client = client;
    }

    async handle(interaction) {
        if (!interaction.isModalSubmit()) return;

        const [category, action, ...params] = interaction.customId.split('_');

        try {
            const handler = this.client.modals.get(`${category}_${action}`);

            if (!handler) {
                logger.warn(`No handler found for modal: ${interaction.customId}`);
                return interaction.reply({
                    content: 'This modal handler is no longer active.',
                    ephemeral: true
                });
            }

            await handler.execute(interaction, params);

        } catch (error) {
            logger.error(`Modal handling error: ${error}`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while processing this form.',
                    ephemeral: true
                });
            }
        }
    }
}

module.exports = ModalHandler;
