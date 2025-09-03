/**
 * @file Guild Member Add Event Handler (guildMemberAdd.js)
 * @description This event triggers when a new member joins a guild (server).
 * Automatically sends a personalized welcome banner to the designated welcome channel.
 * @author Nexium Bot Development Team
 */

const { Events, EmbedBuilder, MessageFlags, AttachmentBuilder } = require('discord.js');
const DynamicBannerGenerator = require('../services/DynamicBannerGenerator');
const logger = require('../utils/logger');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    /**
     * The main execution function for the GuildMemberAdd event.
     * @param {import('discord.js').GuildMember} member The member who joined the guild.
     */
    async execute(member) {
        try {
            // Skip if member is a bot
            if (member.user.bot) {
                logger.info(`Bot ${member.user.tag} joined ${member.guild.name}, skipping welcome banner.`);
                return;
            }

            logger.info(`New member ${member.user.tag} joined ${member.guild.name}, generating welcome banner...`);

            // Get the welcome channel from guild settings or use a default
            const welcomeChannel = await getWelcomeChannel(member.guild);

            if (!welcomeChannel) {
                logger.warn(`No welcome channel configured for guild ${member.guild.name}`);
                return;
            }

            // Generate the welcome banner
            const bannerGenerator = new DynamicBannerGenerator();

            // Get server stats
            const serverStats = {
                memberCount: member.guild.memberCount,
                name: member.guild.name
            };

            const bannerBuffer = await bannerGenerator.createWelcomeBanner(member, serverStats, {
                returnBuffer: true
            });

            if (!bannerBuffer) {
                logger.error(`Failed to generate welcome banner for ${member.user.tag}`);
                return;
            }

            // Create embed with the welcome banner
            const welcomeEmbed = new EmbedBuilder()
                .setTitle(`🌟 Welcome to ${member.guild.name}! 🌟`)
                .setDescription(`**${member.user.displayName}** has joined our dimensional adventure! 🎉\n\nWe're excited to have you explore the multiverse with us!`)
                .setImage('attachment://welcome-banner.png')
                .setColor(0x7C3AED) // Primary purple color
                .setTimestamp()
                .setFooter({
                    text: 'Nexium RPG Bot',
                    iconURL: member.guild.iconURL()
                });

            // Create attachment
            const attachment = new AttachmentBuilder(bannerBuffer, { name: 'welcome-banner.png' });

            // Send the welcome message with the banner
            await welcomeChannel.send({
                embeds: [welcomeEmbed],
                files: [attachment],
                flags: MessageFlags.IsComponentsV2
            });

            logger.info(`Welcome banner sent successfully for ${member.user.tag} in ${member.guild.name}`);

        } catch (error) {
            logger.error(`Error in guildMemberAdd event for ${member.user.tag}:`, error);

            // Fallback: Send a simple text welcome if banner generation fails
            try {
                const welcomeChannel = await getWelcomeChannel(member.guild);
                if (welcomeChannel) {
                    await welcomeChannel.send({
                        content: `🌟 Welcome **${member.user.displayName}** to **${member.guild.name}**! 🎉\n\nWe're excited to have you join our dimensional adventure!`,
                        flags: MessageFlags.IsComponentsV2
                    });
                }
            } catch (fallbackError) {
                logger.error('Fallback welcome message also failed:', fallbackError);
            }
        }
    },
};

/**
 * Gets the welcome channel for a guild.
 * Priority: 1) Guild-specific setting, 2) Channel named 'welcome', 3) General channel
 * @param {import('discord.js').Guild} guild The guild to get the welcome channel for.
 * @returns {import('discord.js').TextChannel|null} The welcome channel or null if not found.
 */
async function getWelcomeChannel(guild) {
    try {
        // First, try to find a channel named 'welcome' (case insensitive)
        let welcomeChannel = guild.channels.cache.find(channel =>
            channel.name.toLowerCase().includes('welcome') &&
            channel.type === 0 // TEXT CHANNEL
        );

        // If no welcome channel found, try 'general' or 'main'
        if (!welcomeChannel) {
            welcomeChannel = guild.channels.cache.find(channel =>
                (channel.name.toLowerCase().includes('general') ||
                 channel.name.toLowerCase().includes('main') ||
                 channel.name.toLowerCase() === 'chat') &&
                channel.type === 0
            );
        }

        // If still no channel found, use the first text channel the bot can send to
        if (!welcomeChannel) {
            welcomeChannel = guild.channels.cache.find(channel =>
                channel.type === 0 &&
                channel.permissionsFor(guild.members.me).has(['SendMessages', 'AttachFiles'])
            );
        }

        return welcomeChannel;
    } catch (error) {
        logger.error(`Error getting welcome channel for guild ${guild.name}:`, error);
        return null;
    }
}
