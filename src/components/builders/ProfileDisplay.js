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
    ThumbnailBuilder,
    ContainerBuilder
} = require('discord.js');
const { COLORS, EMOJIS } = require('../../config/constants');

class ProfileDisplay {
    /**
     * Formats dimension names from underscore format to readable format
     * @param {string} dimensionName - The raw dimension name (e.g., "nexus_hub")
     * @returns {string} Formatted dimension name (e.g., "Nexus Hub")
     */
    /**
     * Calculates the time until next daily claim
     * @param {Date|string} lastDaily - The last daily claim date
     * @returns {string} Formatted countdown string
     */
    /**
     * Formats dimension names from underscore or slug format to readable Title Case
     * @param {string} dimensionName
     * @returns {string}
     */
    static formatDimensionName(dimensionName) {
        if (!dimensionName || typeof dimensionName !== 'string') return 'Unknown';
        // Replace common separators with spaces, split into words, then Title Case each
        return dimensionName
            .replace(/[-_]+/g, ' ')
            .split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
    }
    static getDailyCountdown(lastDaily) {
        if (!lastDaily) return 'Available now! 🎉';
        
        const lastClaim = new Date(lastDaily);
        const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
        const now = new Date();
        
        if (now >= nextClaim) return 'Available now! 🎉';
        
        const diffMs = nextClaim - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    /**
     * Creates a profile embed with interactive buttons
     * @param {Object} userData - User profile data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Message options with embed and components
     */
    static createProfileEmbed(userData, targetUser) {
        // Format dimension name before using in template
        const formattedDimension = this.formatDimensionName(userData.currentDimension);
        
        const profileStats = [
            `**Level:** \`${userData.level}\``,
            `**Experience:** \`${userData.exp.toLocaleString()}\``,
            `**Energy:** \`${userData.dimensionalEnergy}/${userData.maxEnergy}\``,
            `**Coins:** \`${userData.coins.toLocaleString()}\``,
            `**${EMOJIS.SHARD} Shards:** \`${userData.shards?.toLocaleString() || '0'}\``,
            `**Collection:** \`${userData.collectionCount || 0} cards\``,
            `**Current Dimension:** \`${formattedDimension}\``,
            `**Daily Streak:** \`${userData.dailyStreak} days\``
        ].join('\n');

        const progressStats = [
            `**Next Level:** \`${(userData.level * 1000).toLocaleString()} XP\``,
            `**Progress:** \`${Math.floor((userData.exp % 1000) / 10)}%\``,
            `**Energy Regen:** \`+10 every 5 minutes\``
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
                    .setEmoji({ name: '🎒' })
            );

        const section2 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`## 📊 Progress Details\n${progressStats}`)
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_collection_${targetUser.id}`)
                    .setLabel('View Collection')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji({ name: '📚' })
            );

        const section3 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`## ⚡ Energy Status\n**Current:** ${userData.dimensionalEnergy}/${userData.maxEnergy}\n**Regeneration:** Active\n**Last Regen:** ${new Date().toLocaleTimeString()}`)
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_stats_${targetUser.id}`)
                    .setLabel('Detailed Stats')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji({ name: '📊' })
            );

        const section4 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`## 💰 Economy Overview\n**Coins:** ${userData.coins.toLocaleString()}\n**Daily Streak:** ${userData.dailyStreak} days\n**Next Daily:** ${this.getDailyCountdown(userData.lastDaily)}\n**Last Daily:** ${userData.lastDaily ? new Date(userData.lastDaily).toLocaleDateString() : 'Never'}`)
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_daily_${targetUser.id}`)
                    .setLabel('Claim Daily')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji({ name: '🎁' })
            );

        const section5 = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`## 🛒 Shop Access\nBrowse items, characters, and upgrades available in the dimensional shop.`)
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_shop_${targetUser.id}`)
                    .setLabel('Open Shop')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji({ name: '🛒' })
            );

        const container = new ContainerBuilder()
            .setAccentColor(0x0099FF)
            .addSectionComponents(section1)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(section2)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(section3)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(section4)
            .addSeparatorComponents(separator => separator)
            .addSectionComponents(section5);

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }

    /**
     * Creates a detailed stats embed
     * @param {Object} userData - User profile data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Message options with detailed stats
     */
    static createDetailedStatsEmbed(userData, targetUser) {
        // Format dimension name before using in template
        const formattedDimension = this.formatDimensionName(userData.currentDimension);
        
        const progressStats = [
            `**Level:** ${userData.level}`,
            `**Experience:** ${userData.exp.toLocaleString()}`,
            `**Next Level:** ${(userData.level * 1000).toLocaleString()} XP`,
            `**Progress:** ${Math.floor((userData.exp % 1000) / 10)}%`,
            `**Level Progress Bar:** ${'█'.repeat(Math.floor((userData.exp % 1000) / 100))}${'░'.repeat(10 - Math.floor((userData.exp % 1000) / 100))}`
        ].join('\n');

        const energyStats = [
            `**Current Energy:** ${userData.dimensionalEnergy}/${userData.maxEnergy}`,
            `**Regeneration Rate:** +10 every 5 minutes`,
            `**Time to Full:** ${Math.ceil((userData.maxEnergy - userData.dimensionalEnergy) / 10) * 5} minutes`,
            `**Last Regeneration:** ${new Date().toLocaleTimeString()}`,
            `**Energy Efficiency:** ${userData.dimensionalEnergy > userData.maxEnergy * 0.8 ? 'High' : userData.dimensionalEnergy > userData.maxEnergy * 0.5 ? 'Medium' : 'Low'}`
        ].join('\n');

        const economyStats = [
            `**Total Coins:** ${userData.coins.toLocaleString()}`,
            `**Daily Streak:** ${userData.dailyStreak} days`,
            `**Daily Reward Multiplier:** ${Math.min(userData.dailyStreak * 0.1 + 1, 2).toFixed(1)}x`,
            `**Last Daily Claim:** ${userData.lastDaily ? new Date(userData.lastDaily).toLocaleDateString() : 'Never'}`,
            `**Estimated Daily Value:** ${Math.floor(100 * (Math.min(userData.dailyStreak * 0.1 + 1, 2)))} coins`
        ].join('\n');

        const activityStats = [
            `**Current Dimension:** ${formattedDimension}`,
            `**Total Dimensions Visited:** ${userData.dimensionsVisited || 1}`,
            `**Account Created:** ${new Date(userData.createdAt || Date.now()).toLocaleDateString()}`,
            `**Days Active:** ${Math.floor((Date.now() - (userData.createdAt || Date.now())) / (1000 * 60 * 60 * 24))}`,
            `**Activity Status:** ${userData.dimensionalEnergy > 0 ? 'Active' : 'Resting'}`
        ].join('\n');

        const detailedStatsSection = new SectionBuilder()
            .addTextDisplayComponents(
                td => td.setContent(`# ${EMOJIS.LEVEL} Detailed Statistics\n**${targetUser.username}**'s comprehensive dimensional profile\n\nThis section provides in-depth analysis of your dimensional journey.`),
                td => td.setContent(`## 📊 Progress Statistics\n${progressStats}`),
                td => td.setContent(`## ⚡ Energy Analysis\n${energyStats}`),
                td => td.setContent(`## 💰 Economy Details\n${economyStats}`),
                td => td.setContent(`## 🌌 Activity Overview\n${activityStats}`)
            )
            .setButtonAccessory(
                btn => btn
                    .setCustomId(`profile_back_${targetUser.id}`)
                    .setLabel('Back to Profile')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji({ name: '⬅️' })
            );

        const container = new ContainerBuilder()
            .setAccentColor(0x0099FF)
            .addSectionComponents(detailedStatsSection);

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }
}

module.exports = ProfileDisplay;
