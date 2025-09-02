const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const UserService = require('../../services/UserService');
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
            await interaction.deferReply();

            const profile = await userService.getOrCreateUser(targetUser.id, targetUser.username);

            const embed = new EmbedBuilder()
                .setTitle(`${EMOJIS.DIMENSION} Dimensional Profile`)
                .setDescription(`**${targetUser.username}**'s journey through the multiverse`)
                .setColor(COLORS.PRIMARY)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: `${EMOJIS.LEVEL} Level`,
                        value: `\`${profile.level}\``,
                        inline: true
                    },
                    {
                        name: `${EMOJIS.EXP} Experience`,
                        value: `\`${profile.exp.toLocaleString()}\``,
                        inline: true
                    },
                    {
                        name: `${EMOJIS.ENERGY} Energy`,
                        value: `\`${profile.dimensionalEnergy}/${profile.maxEnergy}\``,
                        inline: true
                    },
                    {
                        name: `${EMOJIS.COIN} Coins`,
                        value: `\`${profile.coins.toLocaleString()}\``,
                        inline: true
                    },
                    {
                        name: `${EMOJIS.DIMENSION} Current Dimension`,
                        value: `\`${profile.currentDimension}\``,
                        inline: true
                    },
                    {
                        name: `${EMOJIS.STREAK} Daily Streak`,
                        value: `\`${profile.dailyStreak} days\``,
                        inline: true
                    }
                )
                .setFooter({ text: `ID: ${targetUser.id}` })
                .setTimestamp();

            // Components V2 - Create action buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`profile_stats_${targetUser.id}`)
                        .setLabel('Detailed Stats')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('📊'),
                    new ButtonBuilder()
                        .setCustomId(`profile_characters_${targetUser.id}`)
                        .setLabel('Characters')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('👥'),
                    new ButtonBuilder()
                        .setCustomId(`profile_achievements_${targetUser.id}`)
                        .setLabel('Achievements')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🏆')
                );

            await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            console.error('Profile command error:', error);
            await interaction.editReply({
                content: 'An error occurred while fetching the profile.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
