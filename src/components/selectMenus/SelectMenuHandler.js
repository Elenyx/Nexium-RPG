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
            let handler = this.client.selectMenus.get(`${category}_${action}`);

            // Special handling for shop category selection
            if (category === 'shop' && action === 'category') {
                handler = this.handleShopCategorySelection.bind(this);
            }

            if (!handler) {
                logger.warn(`No handler found for select menu: ${interaction.customId}`);
                return interaction.reply({
                    content: 'This select menu is no longer active.',
                    flags: require('discord.js').MessageFlags.Ephemeral
                });
            }

            await handler(interaction, params);

        } catch (error) {
            logger.error(`Select menu handling error: ${error}`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while processing this selection.',
                    flags: require('discord.js').MessageFlags.Ephemeral
                });
            }
        }
    }

    async handleShopCategorySelection(interaction, params) {
        const [userId] = params;
        const categoryId = interaction.values[0]; // Get selected category from values

        try {
            await interaction.deferUpdate();

            const ComponentRegistry = require('../ComponentRegistry');
            const UserService = require('../../services/UserService');
            const registry = new ComponentRegistry();
            const userService = new UserService();

            const targetUser = await this.client.users.fetch(userId);
            const profile = await userService.getOrCreateUser(userId, targetUser.username);
            // Resolve items for the selected category from the registry (avoid using undefined variable)
            const items = registry.getSampleShopItems(categoryId);
            const shopDisplay = registry.createShopCategory(categoryId, items, profile, targetUser, 1);

            // Edit reply using the display returned by the registry. Do not attempt to unset Components V2 flag.
            await interaction.editReply(shopDisplay);

        } catch (error) {
            logger.error('Error handling shop category selection:', error);
            await interaction.editReply({
                content: 'An error occurred while loading the shop category.',
                flags: require('discord.js').MessageFlags.Ephemeral
            });
        }
    }
}

module.exports = SelectMenuHandler;
