const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help and information about the bot'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`${EMOJIS.DIMENSION} Nexium Bot Help`)
            .setDescription('Welcome to the Dimensional Nexus! Here\'s how to get started:')
            .setColor(COLORS.PRIMARY)
            .addFields(
                {
                    name: `${EMOJIS.ENERGY} Getting Started`,
                    value: '• `/profile` - View your dimensional profile\n• `/ping` - Check bot latency\n• `/help` - Show this help message',
                    inline: false
                },
                {
                    name: `${EMOJIS.LEVEL} Progression`,
                    value: '• Earn experience through commands\n• Level up to unlock new features\n• Complete daily challenges',
                    inline: false
                },
                {
                    name: `${EMOJIS.COIN} Economy`,
                    value: '• Collect coins through activities\n• Use coins for various purchases\n• Trade with other players',
                    inline: false
                },
                {
                    name: `${EMOJIS.DIMENSION} Dimensions`,
                    value: '• Travel between different anime worlds\n• Each dimension has unique features\n• Unlock new dimensions as you progress',
                    inline: false
                }
            )
            .setFooter({ text: 'Nexium Bot v1.0.0' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Support Server')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/nexium'), // Placeholder URL
                new ButtonBuilder()
                    .setLabel('GitHub')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://github.com/Elenyx/Nexium-RPG'),
                new ButtonBuilder()
                    .setCustomId('help_commands')
                    .setLabel('Command List')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
