/**
 * CollectionButtonHandlers.js - Handles button interactions for collection pagination
 */

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { User, Character, UserCharacter } = require('../../database/models');
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
        const [action, targetUserId, currentPageStr] = interaction.customId.split('_').slice(1);
        const currentPage = parseInt(currentPageStr);
        const targetUser = await interaction.client.users.fetch(targetUserId);

        try {
            await interaction.deferUpdate();

            // Get user's characters from database
            const userCharacters = await UserCharacter.findAll({
                where: { userId: targetUserId },
                include: [{
                    model: Character,
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

                return await interaction.editReply({ embeds: [embed], components: [] });
            }

            // Transform data for CardAlbum
            const characters = userCharacters.map(uc => ({
                id: uc.character.id,
                name: uc.character.name,
                rarity: uc.character.rarity,
                imagePath: uc.character.imagePath
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

            // Create embed with the generated image
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.COLLECTION} ${targetUser.username}'s Character Collection`)
                .setDescription(`**${characters.length}** characters collected • Page **${newPage + 1}** of **${totalPages}**`)
                .setImage('attachment://collection.png')
                .setFooter({
                    text: `Use /collection page:${newPage + 2} to view next page`,
                    iconURL: targetUser.displayAvatarURL()
                })
                .setTimestamp();

            // Add navigation buttons if there are multiple pages
            const components = [];
            if (totalPages > 1) {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`collection_prev_${targetUserId}_${newPage}`)
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⬅️')
                            .setDisabled(newPage === 0),
                        new ButtonBuilder()
                            .setCustomId(`collection_next_${targetUserId}_${newPage}`)
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('➡️')
                            .setDisabled(newPage === totalPages - 1)
                    );
                components.push(row);
            }

            await interaction.editReply({
                embeds: [embed],
                files: [{
                    attachment: albumBuffer,
                    name: 'collection.png'
                }],
                components: components
            });

        } catch (error) {
            console.error('Collection button handler error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Collection Error`)
                .setDescription('An error occurred while loading the collection page.')
                .setFooter({ text: 'Please try again later' });

            await interaction.editReply({
                embeds: [errorEmbed],
                components: []
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
