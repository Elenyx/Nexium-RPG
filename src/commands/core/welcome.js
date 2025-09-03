/**
 * @file welcome.js
 * @description Welcome command that generates dynamic welcome banners
 * @author Nexium Bot Development Team
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const DynamicBannerGenerator = require('../../services/DynamicBannerGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Generate a personalized welcome banner')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to welcome (defaults to yourself)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Custom welcome message')
                .setRequired(false)),

    async execute(interaction) {
        try {
            await interaction.deferReply();

            const targetUser = interaction.options.getUser('user') || interaction.user;
            const customMessage = interaction.options.getString('message');

            // Initialize banner generator
            const bannerGenerator = new DynamicBannerGenerator();

            // Get server stats
            const guild = interaction.guild;
            const serverStats = {
                members: guild.memberCount.toLocaleString(),
                characters: '57+',
                battles: 'Active',
                economy: 'Thriving'
            };

            // Generate welcome banner
            const bannerUrl = await bannerGenerator.createWelcomeBanner(targetUser, serverStats, {
                timestamp: true,
                customMessage: customMessage
            });

            // Create embed with the banner
            const embed = new EmbedBuilder()
                .setTitle(`🎉 Welcome ${targetUser.username}!`)
                .setDescription(customMessage || 'Your dimensional adventure begins in Nexium!')
                .setImage(bannerUrl)
                .setColor(0x7C3AED)
                .setFooter({
                    text: `Generated for ${interaction.guild.name}`,
                    iconURL: interaction.guild.iconURL()
                })
                .setTimestamp();

            // Add some helpful information
            embed.addFields(
                {
                    name: '🚀 Getting Started',
                    value: 'Use `/help` to explore all available commands',
                    inline: true
                },
                {
                    name: '🎴 First Steps',
                    value: 'Try `/pull` to get your first character!',
                    inline: true
                },
                {
                    name: '⚔️ Join Battles',
                    value: 'Use `/battle` to test your skills',
                    inline: true
                }
            );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in welcome command:', error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Welcome Banner Error')
                .setDescription('Sorry, I couldn\'t generate a welcome banner right now. Please try again later.')
                .setColor(0xEF4444)
                .setFooter({ text: 'If this persists, contact the server administrators' });

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
