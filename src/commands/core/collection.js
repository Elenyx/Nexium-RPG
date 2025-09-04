const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, TextDisplayBuilder, SectionBuilder, ContainerBuilder } = require('discord.js');
const { models } = require('../../database/connection');
const CardAlbum = require('../../services/CardAlbum');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collection')
        .setDescription('View your character collection as a beautiful card album')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number to view')
                .setRequired(false)
                .setMinValue(1))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to view collection of')
                .setRequired(false)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const requestedPage = interaction.options.getInteger('page') || 1;
        const page = requestedPage - 1; // Convert to 0-based indexing

        try {
            // Defer reply since image generation might take time
            await interaction.deferReply();

            // Check if database is available
            if (!models) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                    .setDescription('The database is not configured. Please check your environment variables.');

                return await interaction.editReply({ 
                    embeds: [embed], 
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
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Empty Collection`)
                    .setDescription(`${targetUser.username} hasn't collected any characters yet!`)
                    .setFooter({ text: 'Start collecting characters to build your album!' });

                return await interaction.editReply({ 
                    embeds: [embed], 
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
            const albumBuffer = await cardAlbum.generateAlbum(characters, page, {
                id: targetUser.id,
                username: targetUser.username
            });

            // Get characters for current page
            const startIndex = page * 8;
            const endIndex = Math.min(startIndex + 8, characters.length);
            const pageCharacters = characters.slice(startIndex, endIndex);

            // Create character list for current page
            const rarityEmojis = {
                'COMMON': '⚪',
                'RARE': '🟢',
                'EPIC': '🟣',
                'LEGENDARY': '🟡',
                'MYTHIC': '🔴',
                'DIMENSIONAL': '🌌'
            };

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

            let characterList = '';
            pageCharacters.forEach((character, index) => {
                const rarityEmoji = rarityEmojis[character.rarity] || '⚪';
                const cardNumber = startIndex + index + 1;
                const favoriteEmoji = character.isFavorite ? '🔥' : '';
                const stars = generateStars(character.rarity);
                const levelDisplay = `◈${character.customLevel}`;
                
                characterList += `${favoriteEmoji} ${character.id} · ${stars} · #${cardNumber.toString().padStart(4, '0')} · ${levelDisplay} · ${character.anime} · ${character.name}\n`;
            });

            // Create embed with the generated image
            const totalPages = Math.ceil(characters.length / 8);
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.COLLECTION} ${targetUser.username}'s Character Collection`)
                .setDescription(`**${characters.length}** characters collected • Page **${page + 1}** of **${totalPages}**`)
                .setImage('attachment://collection.png')
                .setFooter({
                    text: `Use /collection page:${page + 2} to view next page`,
                    iconURL: targetUser.displayAvatarURL()
                })
                .setTimestamp();

            // Create components for Components V2
            const components = [];

            // Add character list as a Container with TextDisplay component
            if (characterList.trim()) {
                const characterContainer = new ContainerBuilder()
                    .setAccentColor(COLORS.SUCCESS)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`**Characters on this page:**\n${characterList.trim()}`)
                    );
                
                components.push(characterContainer);
            }

            // Add navigation buttons if there are multiple pages
            if (totalPages > 1) {
                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`collection_prev_${targetUser.id}_${page}`)
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⬅️')
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId(`collection_next_${targetUser.id}_${page}`)
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('➡️')
                            .setDisabled(page === totalPages - 1)
                    );
                components.push(buttonRow);
            }

            await interaction.editReply({
                embeds: [embed],
                files: [{
                    attachment: albumBuffer,
                    name: 'collection.png'
                }],
                components: components,
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Collection command error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Collection Error`)
                .setDescription('An error occurred while generating your collection album.')
                .setFooter({ text: 'Please try again later' });

            if (interaction.deferred) {
                await interaction.editReply({ 
                    embeds: [errorEmbed], 
                    flags: MessageFlags.IsComponentsV2 
                });
            } else {
                await interaction.reply({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
                });
            }
        }
    }
};
