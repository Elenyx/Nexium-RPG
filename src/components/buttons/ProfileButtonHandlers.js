/**
 * @file Profile Button Handlers
 * @description Handles profile-related button interactions
 * @author Nexium Bot Development Team
 */

const ComponentRegistry = require('../ComponentRegistry');
const UserService = require('../../services/UserService');
const sampleCharacters = require('../../assets/sample/SampleCharacters');
const { SectionBuilder, TextDisplayBuilder, MessageFlags, ButtonStyle } = require('discord.js');

class ProfileButtonHandlers {
    constructor(client) {
        this.client = client;
        this.registry = new ComponentRegistry();
        this.userService = new UserService();
    }

    /**
     * Handles profile inventory button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleInventory(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            // TODO: Implement inventory system
            const embed = {
                title: '🎒 Inventory System',
                description: 'Inventory system coming soon!\n\nThis will show your collected items, equipment, and consumables.',
                color: 0x3B82F6,
                footer: { text: 'Use /profile to return to your profile' }
            };

            const row = {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 2,
                        label: 'Back to Profile',
                        emoji: '⬅️',
                        custom_id: `profile_back_${userId}`
                    }
                ]
            };

            await interaction.editReply({
                embeds: [embed],
                components: [row],
                flags: 128 // MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Error handling inventory button:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while loading your inventory.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Handles profile collection button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleCollection(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            // Use sample characters for testing
            const characters = sampleCharacters;
            const totalPages = Math.ceil(characters.length / 6) || 1; // 6 per page for modern view

            // Use adaptive collection that chooses the best display format
            const collectionDisplay = await this.registry.createAdaptiveCollection(
                characters,
                targetUser,
                'modern', // Default to modern display
                1,
                totalPages
            );

            // Handle Components V2 response format
            const responseOptions = {
                components: collectionDisplay.components || []
            };

            // Add flags for Components V2
            if (collectionDisplay.flags) {
                responseOptions.flags = collectionDisplay.flags;
            }

            // Only add files if they exist (for backward compatibility)
            if (collectionDisplay.files && collectionDisplay.files.length > 0) {
                responseOptions.files = collectionDisplay.files;
            }

            await interaction.editReply(responseOptions);

        } catch (error) {
            console.error('Error handling collection button:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while loading your collection.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Handles profile stats button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleStats(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);
            const statsDisplay = this.registry.createDetailedStats(profile, targetUser);

            await interaction.editReply(statsDisplay);

        } catch (error) {
            console.error('Error handling stats button:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while loading detailed stats.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Handles profile daily button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleDaily(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            // Check if daily already claimed
            const now = new Date();
            const lastDaily = profile.lastDaily ? new Date(profile.lastDaily) : null;
            const canClaim = !lastDaily || (now - lastDaily) >= 24 * 60 * 60 * 1000; // 24 hours

            if (!canClaim) {
                const timeLeft = Math.ceil((24 * 60 * 60 * 1000 - (now - lastDaily)) / (60 * 60 * 1000));
                const infoSection = new SectionBuilder()
                    .addTextDisplayComponents(
                        td => td.setContent(`⏰ You can claim your daily reward again in ${timeLeft} hours!`)
                    );
                await interaction.editReply({
                    components: [infoSection],
                    flags: MessageFlags.IsComponentsV2
                });
                return;
            }

            // Award daily reward
            const reward = 500; // Base daily reward
            profile.coins += reward;
            profile.lastDaily = now;
            profile.dailyStreak = (profile.dailyStreak || 0) + 1;

            await profile.save();

            const successSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent(`# 🎁 Daily Reward Claimed!\nYou've successfully claimed your daily reward!`),
                    td => td.setContent(`**💰 Reward Earned:** ${reward.toLocaleString()} coins\n**🔥 Daily Streak:** ${profile.dailyStreak} days\n**💰 New Balance:** ${profile.coins.toLocaleString()} coins`),
                    td => td.setContent(`*Come back tomorrow for more rewards!*`)
                )
                .setButtonAccessory(
                    btn => btn
                        .setCustomId(`profile_back_${userId}`)
                        .setLabel('Back to Profile')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                );

            await interaction.editReply({
                components: [successSection],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Error handling daily button:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while claiming your daily reward.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Handles profile shop button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleShop(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);
            const categories = this.registry.getDefaultShopCategories();
            const shopDisplay = this.registry.createShopInterface(categories, profile, targetUser);

            await interaction.editReply(shopDisplay);

        } catch (error) {
            console.error('Error handling shop button:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while opening the shop.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Handles profile back button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleBack(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);
            const profileDisplay = this.registry.createProfile(profile, targetUser);

            await interaction.editReply(profileDisplay);

        } catch (error) {
            console.error('Error handling back button:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while returning to profile.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Handles collection view switch button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleCollectionSwitch(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            // Use sample characters for testing
            const characters = sampleCharacters;
            const totalPages = Math.ceil(characters.length / 10) || 1; // Use 10 for classic view

            // Switch to classic embed view
            const collectionDisplay = await this.registry.createAdaptiveCollection(
                characters,
                targetUser,
                'classic', // Switch to classic display
                1,
                totalPages
            );

            await interaction.editReply(collectionDisplay);

        } catch (error) {
            console.error('Error handling collection switch:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while switching collection view.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Handles switch to modern collection view
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleCollectionSwitchModern(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            // Use sample characters for testing
            const characters = sampleCharacters;
            const totalPages = Math.ceil(characters.length / 6) || 1; // Use 6 for modern view

            // Switch to modern container view
            const collectionDisplay = await this.registry.createAdaptiveCollection(
                characters,
                targetUser,
                'modern', // Switch to modern display
                1,
                totalPages
            );

            await interaction.editReply(collectionDisplay);

        } catch (error) {
            console.error('Error handling collection switch to modern:', error);
            const errorSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent('An error occurred while switching to modern collection view.')
                );
            await interaction.editReply({
                components: [errorSection],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }
}

module.exports = ProfileButtonHandlers;
