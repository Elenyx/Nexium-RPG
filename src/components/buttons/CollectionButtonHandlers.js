/**
 * CollectionButtonHandlers.js - Handles button interactions for collection pagination
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, TextDisplayBuilder, ContainerBuilder, MediaGalleryBuilder } = require('discord.js');
const { models } = require('../../database/connection');
const CardAlbum = require('../../services/CardAlbum');
const { COLORS, EMOJIS } = require('../../config/constants');

class CollectionButtonHandlers {
    constructor() {
        this.name = 'collection';
    }

    /**
     * Handle collection button interactions
     * @param {ButtonInteraction} interaction - The button interaction
     */
    async handle(interaction) {
        const parts = interaction.customId.split('_');
        const [action, targetUserId, currentPageStr, context] = parts.slice(1);
        const currentPage = parseInt(currentPageStr);
        const isFromProfile = context === 'profile';
        const targetUser = await interaction.client.users.fetch(targetUserId);

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
                where: { userId: targetUserId },
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

            // Transform data for CardAlbum - optimize by pre-rendering URLs
            const characters = await Promise.all(userCharacters.map(async uc => {
                const characterData = uc.character.toJSON();
                
                // Pre-render card URLs in parallel for better performance
                const cardRenderer = new CharacterCardRenderer();
                try {
                    characterData.image = await cardRenderer.renderCardUrl(characterData);
                } catch (error) {
                    console.warn(`Failed to render card for ${characterData.name}:`, error.message);
                    characterData.image = null;
                }
                
                return {
                    ...characterData,
                    customLevel: uc.customLevel,
                    isFavorite: uc.isFavorite,
                    collectedShards: uc.collectedShards
                };
            }));

            // Calculate new page
            const totalPages = Math.ceil(characters.length / 8);
            let newPage = currentPage;

            if (action === 'prev' && currentPage > 0) {
                newPage = currentPage - 1;
            } else if (action === 'next' && currentPage < totalPages - 1) {
                newPage = currentPage + 1;
            }

            // Generate the card album image
            const cardAlbum = new CardAlbum();
            const albumBuffer = await cardAlbum.generateAlbum(characters, newPage, {
                id: targetUser.id,
                username: targetUser.username
            });

            // Get characters for current page
            const startIndex = newPage * 8;
            const endIndex = Math.min(startIndex + 8, characters.length);
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
                            .setContent(`**${characters.length}** characters collected • Page **${newPage + 1}** of **${totalPages}**\n\n**Characters on this page:**\n${characterList.trim()}`)
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
                const contextSuffix = isFromProfile ? '_profile' : '';
                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`collection_prev_${targetUserId}_${newPage}${contextSuffix}`)
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⬅️')
                            .setDisabled(newPage === 0),
                        new ButtonBuilder()
                            .setCustomId(`collection_next_${targetUserId}_${newPage}${contextSuffix}`)
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('➡️')
                            .setDisabled(newPage === totalPages - 1)
                    );
                components.push(buttonRow);
            }

            // Add back to profile button if accessed from profile
            if (isFromProfile) {
                const backRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`profile_back_${targetUserId}`)
                            .setLabel('Back to Profile')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⬅️')
                    );
                components.push(backRow);
            }

            await interaction.editReply({
                files: [{
                    attachment: albumBuffer,
                    name: 'collection.png'
                }],
                components: components,
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Collection button handler error:', error);

            const errorTextDisplay = new TextDisplayBuilder()
                .setContent(`**${EMOJIS.ERROR} Collection Error**\n\nAn error occurred while loading the collection page.\n\n*Please try again later*`);

            await interaction.editReply({
                components: [errorTextDisplay],
                flags: MessageFlags.IsComponentsV2
            });
        }
    }

    /**
     * Check if this handler can handle the given custom ID
     * @param {string} customId - The button custom ID
     * @returns {boolean} Whether this handler can handle the interaction
     */
    canHandle(customId) {
        return customId.startsWith('collection_');
    }
}

module.exports = CollectionButtonHandlers;