/**
 * @file Profile Button Handlers
 * @description Handles profile-related button interactions
 * @author Nexium Bot Development Team
 */

const ComponentRegistry = require('../ComponentRegistry');
const UserService = require('../../services/UserService');
const InventoryService = require('../../services/InventoryService');
const InventoryDisplay = require('../builders/InventoryDisplay');
const CardAlbum = require('../../services/CardAlbum');
const characters = require('../../assets/characters');
const { SectionBuilder, TextDisplayBuilder, ContainerBuilder, MessageFlags, ButtonStyle, ActionRowBuilder, ButtonBuilder, MediaGalleryBuilder } = require('discord.js');
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

            // Show real inventory using UserService and InventoryDisplay
            const userService = new UserService();
            const userData = await userService.getOrCreateUser(userId, targetUser.username);

            const display = InventoryDisplay.createInventoryView(userData.inventory || {}, targetUser);
            await interaction.editReply(display);

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
                const errorTextDisplay = new TextDisplayBuilder()
                    .setContent(`**${EMOJIS.ERROR} Database Unavailable**\n\nThe database is not configured. Please check your environment variables.`);

                return await interaction.editReply({ 
                    components: [errorTextDisplay], 
                    flags: MessageFlags.IsComponentsV2 
                });
            }

            // Get user's characters from database
            const userCharacters = await models.UserCharacter.findAll({
                where: { userId: targetUser.id },
                include: [{
                    model: models.Character,
                    as: 'character',
                    attributes: ['id', 'name', 'rarity', 'imagePath', 'imageUrl', 'imageUrls', 'anime']
                }],
                attributes: ['customLevel', 'isFavorite', 'collectedShards'],
                order: [['character', 'rarity', 'DESC'], ['character', 'name', 'ASC']]
            });

            if (userCharacters.length === 0) {
                const emptyTextDisplay = new TextDisplayBuilder()
                    .setContent(`**${EMOJIS.ERROR} Empty Collection**\n\n${targetUser.username} hasn't collected any characters yet!\n\n*Start collecting characters to build your album!*`);

                return await interaction.editReply({ 
                    components: [emptyTextDisplay], 
                    flags: MessageFlags.IsComponentsV2 
                });
            }

            // Transform data for CardAlbum
            const characters = userCharacters.map(uc => ({
                id: uc.character.id,
                name: uc.character.name,
                rarity: uc.character.rarity,
                imagePath: uc.character.imagePath,
                imageUrl: uc.character.imageUrl,
                imageUrls: uc.character.imageUrls,
                anime: uc.character.anime,
                customLevel: uc.customLevel,
                isFavorite: uc.isFavorite,
                collectedShards: uc.collectedShards
            }));

            // Generate the card album image
            const cardAlbum = new CardAlbum();
            const albumBuffer = await cardAlbum.generateAlbum(characters, 0, {
                id: targetUser.id,
                username: targetUser.username
            });

            // Get characters for current page
            const startIndex = 0;
            const endIndex = Math.min(8, characters.length);
            const pageCharacters = characters.slice(startIndex, endIndex);

            // Function to generate star rating based on rarity
            const generateStars = (rarity) => {
                const starMap = {
                    'COMMON': '★☆☆☆☆',
                    'RARE': '★★☆☆☆',
                    'EPIC': '★★★☆☆',
                    'LEGENDARY': '★★★★☆',
                    'MYTHIC': '★★★★★',
                    'DIMENSIONAL': '★★★★★'
                };
                return starMap[rarity] || '☆☆☆☆☆';
            };

            // Create formatted character list with markup
            let characterList = '';
            pageCharacters.forEach((character, index) => {
                const cardNumber = startIndex + index + 1;
                const favoriteEmoji = character.isFavorite ? '🔥 ' : '';
                const stars = generateStars(character.rarity);
                const levelDisplay = `△${character.customLevel || 1}`;
                
                // Format: `ID` · ★★★★★ · #CardNumber · △Level · Anime · Character Name
                characterList += `${favoriteEmoji}\`${character.id}\` · ${stars} · #${cardNumber} · ${levelDisplay} · ${character.anime || 'Unknown'} · ${character.name}\n`;
            });

            // Create components for Components V2
            const totalPages = Math.ceil(characters.length / 8);
            const components = [];

            // Add header text display
            const headerTextDisplay = new TextDisplayBuilder()
                .setContent(`**▷ ${targetUser.username}'s Character Collection**`);
            components.push(headerTextDisplay);

            // Add character list as a Container with TextDisplay component
            if (characterList.trim()) {
                const characterContainer = new ContainerBuilder()
                    .setAccentColor(COLORS.SUCCESS)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`**${characters.length}** characters collected • Page **1** of **${totalPages}**\n\n**Characters on this page:**\n${characterList.trim()}`)
                    );
                
                components.push(characterContainer);
            }

            // Add media gallery for the album image
            const mediaGallery = new MediaGalleryBuilder()
                .addItems(mg => mg
                    .setDescription(`${targetUser.username}'s collection album`)
                    .setURL('attachment://collection.png'));
            components.push(mediaGallery);

            // Add navigation buttons if there are multiple pages
            if (totalPages > 1) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`collection_prev_${targetUser.id}_0_profile`)
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '⬅️' })
                            .setDisabled(true), // First page, so disabled
                        new ButtonBuilder()
                            .setCustomId(`collection_next_${targetUser.id}_0_profile`)
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '➡️' })
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
                        .setEmoji({ name: '⬅️' })
                );
            components.push(backRow);

            await interaction.editReply({
                files: [{
                    attachment: albumBuffer,
                    name: 'collection.png'
                }],
                components: components,
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Error handling collection button:', error);
            const errorTextDisplay = new TextDisplayBuilder()
                .setContent(`**${EMOJIS.ERROR} Collection Error**\n\nAn error occurred while generating your collection album.\n\n*Please try again later*`);

            await interaction.editReply({ 
                components: [errorTextDisplay], 
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
                // Use a simple TextDisplayBuilder for warnings to avoid accessory validation issues
                const infoText = new TextDisplayBuilder()
                    .setContent(`⏰ You can claim your daily reward again in ${timeLeft} hours!`);
                await interaction.editReply({
                    components: [infoText],
                    flags: MessageFlags.IsComponentsV2
                });
                return;
            }

            // Award daily reward
            const reward = 500; // Base daily reward
            profile.coins += reward;
            profile.lastDaily = now;
            profile.dailyStreak = (profile.dailyStreak || 0) + 1;

            await this.userService.updateUser(userId, {
                coins: profile.coins,
                lastDaily: profile.lastDaily,
                dailyStreak: profile.dailyStreak
            });

            const successSection = new SectionBuilder()
                .addTextDisplayComponents(
                    td => td.setContent(`# 🎁 Daily Reward Claimed!\nYou've successfully claimed your daily reward!`),
                    td => td.setContent(`**💰 Reward Earned:** ${reward.toLocaleString()} coins\n**🔥 Daily Streak:** ${profile.dailyStreak} days\n**💰 New Balance:** ${profile.coins.toLocaleString()} coins`),
                    td => td.setContent(`*Come back tomorrow for more rewards!*`)
                )
                .setButtonAccessory(
                    button => button
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
