const logger = require('../../utils/logger');

class SelectMenuHandler {
    constructor(client) {
        this.client = client;
    }

    async handle(interaction) {
        if (!interaction.isStringSelectMenu() && !interaction.isUserSelectMenu() &&
            !interaction.isRoleSelectMenu() && !interaction.isChannelSelectMenu()) return;

        const [category, action, ...params] = interaction.customId.split('_');

        try {
            const handler = this.client.selectMenus.get(`${category}_${action}`);

            if (!handler) {
                logger.warn(`No handler found for select menu: ${interaction.customId}`);
                return interaction.reply({
                    content: 'This select menu is no longer active.',
                    ephemeral: true
                });
            }

            await handler.execute(interaction, params);

        } catch (error) {
            logger.error(`Select menu handling error: ${error}`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while processing this selection.',
                    ephemeral: true
                });
            }
        }
    }
}

module.exports = SelectMenuHandler;
