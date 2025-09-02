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
    MessageFlags,
    TextDisplayBuilder,
    SectionBuilder,
    ThumbnailBuilder
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
        const profileStats = [
            `**Level:** \`${userData.level}\``,
            `**Experience:** \`${userData.exp.toLocaleString()}\``,
            `**Energy:** \`${userData.dimensionalEnergy}/${userData.maxEnergy}\``,
            `**Coins:** \`${userData.coins.toLocaleString()}\``,
            `**Current Dimension:** \`${userData.currentDimension}\``,
            `**Daily Streak:** \`${userData.dailyStreak} days\``
        ].join('\n');

        const section1 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`# ${EMOJIS.DIMENSION} Dimensional Profile\n**${targetUser.username}**'s journey through the multiverse\n\n${profileStats}`)
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_inventory_${targetUser.id}`)
                    .setLabel('View Inventory')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎒')
            );

        const section2 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(' ')
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_collection_${targetUser.id}`)
                    .setLabel('View Collection')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📚')
            );

        const section3 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(' ')
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_stats_${targetUser.id}`)
                    .setLabel('Detailed Stats')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📊')
            );

        const section4 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(' ')
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_daily_${targetUser.id}`)
                    .setLabel('Claim Daily')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎁')
            );

        const section5 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(' ')
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_shop_${targetUser.id}`)
                    .setLabel('Open Shop')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🛒')
            );

        const section6 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(' ')
            )
            .setButtonAccessory(
                btn => btn
                    .setLabel('View on Web')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`${process.env.FRONTEND_URL || 'https://nexium-production.up.railway.app'}/collection`)
                    .setEmoji('🌐')
            );

        return {
            components: [section1, section2, section3, section4, section5, section6],
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
        const progressStats = [
            `**Level:** ${userData.level}`,
            `**Experience:** ${userData.exp.toLocaleString()}`,
            `**Next Level:** ${(userData.level * 1000).toLocaleString()} XP`,
            `**Progress:** ${Math.floor((userData.exp % 1000) / 10)}%`
        ].join('\n');

        const energyStats = [
            `**Current:** ${userData.dimensionalEnergy}/${userData.maxEnergy}`,
            `**Regeneration:** +10 every 5 minutes`,
            `**Last Regen:** ${new Date().toLocaleTimeString()}`
        ].join('\n');

        const economyStats = [
            `**Coins:** ${userData.coins.toLocaleString()}`,
            `**Daily Streak:** ${userData.dailyStreak} days`,
            `**Last Daily:** ${userData.lastDaily ? new Date(userData.lastDaily).toLocaleDateString() : 'Never'}`
        ].join('\n');

        const section = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`# ${EMOJIS.LEVEL} Detailed Statistics\n**${targetUser.username}**'s comprehensive stats`),
                td => td.setContent(`## 📊 Progress Stats\n${progressStats}`),
                td => td.setContent(`## ⚡ Energy Stats\n${energyStats}`),
                td => td.setContent(`## 💰 Economy Stats\n${economyStats}`)
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_back_${targetUser.id}`)
                    .setLabel('Back to Profile')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        return {
            components: [section],
            flags: MessageFlags.IsComponentsV2
        };
    }
}

module.exports = ProfileDisplay;
