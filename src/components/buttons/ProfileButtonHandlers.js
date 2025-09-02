/**
 * @file Profile Button Handlers
 * @description Handles profile-related button interactions
 * @author Nexium Bot Development Team
 */

const ComponentRegistry = require('../ComponentRegistry');
const UserService = require('../../services/UserService');
const sampleCharacters = require('../../assets/sample/SampleCharacters');

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
            await interaction.editReply({
                content: 'An error occurred while loading your inventory.',
                embeds: [],
                components: []
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

            // Ensure clean response object
            const cleanResponse = {
                embeds: collectionDisplay.embeds || [],
                components: collectionDisplay.components || [],
                files: collectionDisplay.files || []
            };

            await interaction.editReply(cleanResponse);

        } catch (error) {
            console.error('Error handling collection button:', error);
            await interaction.editReply({
                content: 'An error occurred while loading your collection.',
                embeds: [],
                components: []
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
            await interaction.editReply({
                content: 'An error occurred while loading detailed stats.',
                embeds: [],
                components: []
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
                await interaction.editReply({
                    content: `⏰ You can claim your daily reward again in ${timeLeft} hours!`,
                    embeds: [],
                    components: [],
                    flags: 128
                });
                return;
            }

            // Award daily reward
            const reward = 500; // Base daily reward
            profile.coins += reward;
            profile.lastDaily = now;
            profile.dailyStreak = (profile.dailyStreak || 0) + 1;

            await profile.save();

            const embed = {
                title: '🎁 Daily Reward Claimed!',
                description: `You've successfully claimed your daily reward!`,
                color: 0x10B981,
                fields: [
                    {
                        name: '💰 Reward Earned',
                        value: `${reward.toLocaleString()} coins`,
                        inline: true
                    },
                    {
                        name: '🔥 Daily Streak',
                        value: `${profile.dailyStreak} days`,
                        inline: true
                    },
                    {
                        name: '💰 New Balance',
                        value: `${profile.coins.toLocaleString()} coins`,
                        inline: true
                    }
                ],
                footer: { text: 'Come back tomorrow for more rewards!' }
            };

            const row = {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 1,
                        label: 'Back to Profile',
                        emoji: '⬅️',
                        custom_id: `profile_back_${userId}`
                    }
                ]
            };

            await interaction.editReply({
                embeds: [embed],
                components: [row],
                flags: 128
            });

        } catch (error) {
            console.error('Error handling daily button:', error);
            await interaction.editReply({
                content: 'An error occurred while claiming your daily reward.',
                embeds: [],
                components: []
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
            await interaction.editReply({
                content: 'An error occurred while opening the shop.',
                embeds: [],
                components: []
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
            await interaction.editReply({
                content: 'An error occurred while returning to profile.',
                embeds: [],
                components: []
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
            await interaction.editReply({
                content: 'An error occurred while switching collection view.',
                embeds: [],
                components: []
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
            await interaction.editReply({
                content: 'An error occurred while switching to modern collection view.',
                embeds: [],
                components: []
            });
        }
    }
}

module.exports = ProfileButtonHandlers;
