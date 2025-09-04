const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const UserService = require('../../services/UserService');
const ProfileDisplay = require('../../components/builders/ProfileDisplay');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your dimensional profile')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to view profile of')
                .setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const userService = new UserService();

        try {
            const profile = await userService.getOrCreateUser(targetUser.id, targetUser.username);

            // Use the new V2 profile display
            const profileDisplay = ProfileDisplay.createProfileEmbed(profile, targetUser);

            await interaction.reply(profileDisplay);

        } catch (error) {
            console.error('Profile command error:', error);

            const errorMessage = {
                content: 'An error occurred while fetching the profile.',
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
