const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const InventoryService = require('../../services/InventoryService');
const InventoryDisplay = require('../../components/builders/InventoryDisplay');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('View your inventory (shards, items, accessories, frames, gems)'),

    async execute(interaction) {
        const targetUser = interaction.user;
        const invService = new InventoryService();

        try {
            const inventory = await invService.getOrCreateInventory(targetUser.id);
            const display = InventoryDisplay.createInventoryView(inventory.data || {}, targetUser);
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
