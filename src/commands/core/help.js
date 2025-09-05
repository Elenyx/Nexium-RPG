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
                    name: `${EMOJIS.COIN} Collection & Inventory`,
                    value: '• `/pull` - Pull for random characters (100 coins)\n• `/inventory` - View your shards, items, and accessories\n• `/collection` - Browse your character collection as a card album\n• `/card <id>` - View detailed character card information',
                    inline: false
                },
                {
                    name: `${EMOJIS.LEVEL} Character Management`,
                    value: '• `/merge <id>` - Merge duplicate cards to level up characters\n• `/upgrade <id>` - Upgrade characters using shards\n• `/upgrade-rarity <id>` - Upgrade character rarity with shards\n• `/rarity-progress` - View your rarity upgrade progress',
                    inline: false
                },
                {
                    name: `${EMOJIS.DIMENSION} Combat & Quests`,
                    value: '• `/battle <char1> <char2>` - Battle between your characters\n• `/quest` - Complete quests to earn shards and rewards',
                    inline: false
                },
                {
                    name: `${EMOJIS.SETTINGS} Server Management`,
                    value: '• `/welcome` - Set up welcome messages for new members\n• `/setwelcome` - Configure welcome channel and message',
                    inline: false
                }
            )
            .setFooter({ text: 'Nexium Bot v1.0.0 - Use /inventory for a clean view of your items!' })
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
                    .setEmoji({ name: '📋' })
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
