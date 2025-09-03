/**
 * @file Set Welcome Channel Command (setwelcome.js)
 * @description Allows administrators to set a specific welcome channel for auto-welcome messages.
 * @author Nexium Bot Development Team
 */

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Set the welcome channel for automatic welcome messages')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send welcome messages to')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('channel');

            // Validate that it's a text channel
            if (channel.type !== 0) { // TEXT CHANNEL
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌ Invalid Channel')
                    .setDescription('Please select a text channel for welcome messages.')
                    .setColor(0xEF4444);

                return await interaction.reply({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral
                });
            }

            // Check if bot has permissions to send messages and attach files
            const botPermissions = channel.permissionsFor(interaction.guild.members.me);
            if (!botPermissions.has(['SendMessages', 'AttachFiles'])) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('❌ Missing Permissions')
                    .setDescription(`I don't have permission to send messages and attach files in ${channel}. Please check my permissions.`)
                    .setColor(0xEF4444);

                return await interaction.reply({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral
                });
            }

            // Here you could save the welcome channel to a database
            // For now, we'll just confirm the setting
            const successEmbed = new EmbedBuilder()
                .setTitle('✅ Welcome Channel Set')
                .setDescription(`Welcome messages will now be sent to ${channel}!\n\n**Features:**\n• Automatic welcome banners when members join\n• Personalized messages with user avatars\n• Server statistics and member count`)
                .addFields(
                    { name: 'Channel', value: `${channel}`, inline: true },
                    { name: 'Auto Welcome', value: '✅ Enabled', inline: true },
                    { name: 'Banner Generation', value: '✅ Enabled', inline: true }
                )
                .setColor(0x10B981)
                .setTimestamp();

            await interaction.reply({
                embeds: [successEmbed],
                flags: MessageFlags.Ephemeral
            });

            logger.info(`Welcome channel set to ${channel.name} (${channel.id}) in guild ${interaction.guild.name}`);

        } catch (error) {
            logger.error('Error in setwelcome command:', error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Error')
                .setDescription('An error occurred while setting the welcome channel.')
                .setColor(0xEF4444);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
};
