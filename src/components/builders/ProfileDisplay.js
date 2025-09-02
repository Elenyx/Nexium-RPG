/**
 * @file Profile Display Component Builder
 * @description Creates interactive profile displays using Discord Components V2
 * @author Nexium Bot Development Team
 */

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require('discord.js');
const { COLORS, EMOJIS } = require('../../config/constants');

class ProfileDisplay {
    /**
     * Creates a profile embed with interactive buttons
     * @param {Object} userData - User profile data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Message options with embed and components
     */
    static createProfileEmbed(userData, targetUser) {
        const embed = new EmbedBuilder()
            .setTitle(`${EMOJIS.DIMENSION} Dimensional Profile`)
            .setDescription(`**${targetUser.username}**'s journey through the multiverse`)
            .setColor(COLORS.PRIMARY)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: `${EMOJIS.LEVEL} Level`,
                    value: `\`${userData.level}\``,
                    inline: true
                },
                {
                    name: `${EMOJIS.EXP} Experience`,
                    value: `\`${userData.exp.toLocaleString()}\``,
                    inline: true
                },
                {
                    name: `${EMOJIS.ENERGY} Energy`,
                    value: `\`${userData.dimensionalEnergy}/${userData.maxEnergy}\``,
                    inline: true
                },
                {
                    name: `${EMOJIS.COIN} Coins`,
                    value: `\`${userData.coins.toLocaleString()}\``,
                    inline: true
                },
                {
                    name: `${EMOJIS.DIMENSION} Current Dimension`,
                    value: `\`${userData.currentDimension}\``,
                    inline: true
                },
                {
                    name: `${EMOJIS.STREAK} Daily Streak`,
                    value: `\`${userData.dailyStreak} days\``,
                    inline: true
                }
            )
            .setFooter({ text: 'Nexium RPG System' })
            .setTimestamp();

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`profile_inventory_${targetUser.id}`)
                    .setLabel('View Inventory')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎒'),
                new ButtonBuilder()
                    .setCustomId(`profile_collection_${targetUser.id}`)
                    .setLabel('View Collection')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📚'),
                new ButtonBuilder()
                    .setCustomId(`profile_stats_${targetUser.id}`)
                    .setLabel('Detailed Stats')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📊')
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`profile_daily_${targetUser.id}`)
                    .setLabel('Claim Daily')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎁'),
                new ButtonBuilder()
                    .setCustomId(`profile_shop_${targetUser.id}`)
                    .setLabel('Open Shop')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🛒')
            );

        return {
            embeds: [embed],
            components: [row1, row2],
            flags: MessageFlags.IsComponentsV2
        };
    }

    /**
     * Creates a detailed stats embed
     * @param {Object} userData - User profile data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Message options with detailed stats
     */
    static createDetailedStatsEmbed(userData, targetUser) {
        const embed = new EmbedBuilder()
            .setTitle(`${EMOJIS.LEVEL} Detailed Statistics`)
            .setDescription(`**${targetUser.username}**'s comprehensive stats`)
            .setColor(COLORS.INFO)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: '📊 **Progress Stats**',
                    value: [
                        `**Level:** ${userData.level}`,
                        `**Experience:** ${userData.exp.toLocaleString()}`,
                        `**Next Level:** ${(userData.level * 1000).toLocaleString()} XP`,
                        `**Progress:** ${Math.floor((userData.exp % 1000) / 10)}%`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '⚡ **Energy Stats**',
                    value: [
                        `**Current:** ${userData.dimensionalEnergy}/${userData.maxEnergy}`,
                        `**Regeneration:** +10 every 5 minutes`,
                        `**Last Regen:** ${new Date().toLocaleTimeString()}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '💰 **Economy Stats**',
                    value: [
                        `**Coins:** ${userData.coins.toLocaleString()}`,
                        `**Daily Streak:** ${userData.dailyStreak} days`,
                        `**Last Daily:** ${userData.lastDaily ? new Date(userData.lastDaily).toLocaleDateString() : 'Never'}`
                    ].join('\n'),
                    inline: true
                }
            )
            .setFooter({ text: 'Use /profile to return to main view' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`profile_back_${targetUser.id}`)
                    .setLabel('Back to Profile')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        return {
            embeds: [embed],
            components: [row],
            flags: MessageFlags.IsComponentsV2
        };
    }
}

module.exports = ProfileDisplay;
