/**
 * @file Profile Button Handlers
 * @description Handles profile-related button interactions
 * @author Nexium Bot Development Team
 */

const ComponentRegistry = require('../ComponentRegistry');
const UserService = require('../../services/UserService');
const CardAlbum = require('../../services/CardAlbum');
const characters = require('../../assets/characters');
const { SectionBuilder, TextDisplayBuilder, MessageFlags, ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { models } = require('../../database/connection');
const { COLORS, EMOJIS } = require('../../config/constants');

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

            // Check if database is available
            if (!models) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                    .setDescription('The database is not configured. Please check your environment variables.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Get user's characters from database
            const userCharacters = await models.UserCharacter.findAll({
                where: { userId: targetUser.id },
                include: [{
                    model: models.Character,
                    as: 'character',
                    attributes: ['id', 'name', 'rarity', 'imagePath']
                }],
                order: [['character', 'rarity', 'DESC'], ['character', 'name', 'ASC']]
            });

            if (userCharacters.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Empty Collection`)
                    .setDescription(`${targetUser.username} hasn't collected any characters yet!`)
                    .setFooter({ text: 'Start collecting characters to build your album!' });

                return await interaction.editReply({ embeds: [embed] });
            }

            // Transform data for CardAlbum
            const characters = userCharacters.map(uc => ({
                id: uc.character.id,
                name: uc.character.name,
                rarity: uc.character.rarity,
                imagePath: uc.character.imagePath
            }));

            // Generate the card album image (start with page 0)
            const cardAlbum = new CardAlbum();
            const albumBuffer = await cardAlbum.generateAlbum(characters, 0, {
                id: targetUser.id,
                username: targetUser.username
            });

            // Create embed with the generated image
            const totalPages = Math.ceil(characters.length / 8);
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.COLLECTION} ${targetUser.username}'s Character Collection`)
                .setDescription(`**${characters.length}** characters collected • Page **1** of **${totalPages}**`)
                .setImage('attachment://collection.png')
                .setFooter({
                    text: `Use /collection page:2 to view next page`,
                    iconURL: targetUser.displayAvatarURL()
                })
                .setTimestamp();

            // Add navigation buttons if there are multiple pages
            const components = [];
            if (totalPages > 1) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`collection_prev_${targetUser.id}_0_profile`)
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⬅️')
                            .setDisabled(true), // First page, so disabled
                        new ButtonBuilder()
                            .setCustomId(`collection_next_${targetUser.id}_0_profile`)
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('➡️')
                            .setDisabled(totalPages === 1)
                    );
                components.push(row);
            }

            // Add back to profile button
            const backRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`profile_back_${userId}`)
                        .setLabel('Back to Profile')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                );
            components.push(backRow);

            await interaction.editReply({
                embeds: [embed],
                files: [{
                    attachment: albumBuffer,
                    name: 'collection.png'
                }],
                components: components
            });

        } catch (error) {
            console.error('Error handling collection button:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Collection Error`)
                .setDescription('An error occurred while generating your collection album.')
                .setFooter({ text: 'Please try again later' });

            await interaction.editReply({ embeds: [errorEmbed] });
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
                        .setEmoji({ name: '⬅️' })
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

            // Use all characters from the new structure
            const allCharacters = characters.all;
            const totalPages = Math.ceil(allCharacters.length / 10) || 1; // Use 10 for classic view

            // Switch to classic embed view
            const collectionDisplay = await this.registry.createAdaptiveCollection(
                allCharacters,
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

            // Use all characters from the new structure
            const allCharacters = characters.all;
            const totalPages = Math.ceil(allCharacters.length / 6) || 1; // Use 6 for modern view

            // Switch to modern container view
            const collectionDisplay = await this.registry.createAdaptiveCollection(
                allCharacters,
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
