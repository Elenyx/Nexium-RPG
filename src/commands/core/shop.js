const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const UserService = require('../../services/UserService');
const ComponentRegistry = require('../../components/ComponentRegistry');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('🛒 Browse items, characters, and upgrades available in the dimensional shop'),

    async execute(interaction) {
        const targetUser = interaction.user;
        const userService = new UserService();
        const registry = new ComponentRegistry();

        try {
            const profile = await userService.getOrCreateUser(targetUser.id, targetUser.username);
            const categories = registry.getDefaultShopCategories();

            // Create shop interface
            const shopDisplay = registry.createShopInterface(categories, profile, targetUser);

            await interaction.reply(shopDisplay);

        } catch (error) {
            console.error('Shop command error:', error);

            const errorMessage = {
                content: 'An error occurred while opening the shop.',
                flags: MessageFlags.Ephemeral
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
