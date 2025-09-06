const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const UserService = require('../../services/UserService');
const InventoryDisplay = require('../../components/builders/InventoryDisplay');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('View your inventory (shards, items, accessories, frames, gems)'),

    async execute(interaction) {
        const targetUser = interaction.user;
        const userService = new UserService();

        try {
            const userData = await userService.getOrCreateUser(targetUser.id, targetUser.username);
            const display = InventoryDisplay.createInventoryView(userData.inventory || {}, targetUser);
            await interaction.reply(display);
        } catch (error) {
            console.error('Inventory command error:', error);
            const errorMessage = { content: 'Failed to load inventory.', flags: MessageFlags.Ephemeral };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
};
