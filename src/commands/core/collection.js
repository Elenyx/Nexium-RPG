const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, TextDisplayBuilder, ContainerBuilder, MediaGalleryBuilder, AttachmentBuilder } = require('discord.js');
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
        const page = requestedPage - 1;

        try {
            await interaction.deferReply();

            if (!models) {
                const errorTextDisplay = new TextDisplayBuilder()
                    .setContent(`**${EMOJIS.ERROR} Database Unavailable**\n\nThe database is not configured.`);
                return await interaction.editReply({ components: [errorTextDisplay], flags: MessageFlags.IsComponentsV2 });
            }

            const userCharacters = await models.UserCharacter.findAll({
                where: { userId: targetUser.id },
                include: [{
                    model: models.Character,
                    as: 'character',
                }],
                order: [['character', 'rarity', 'DESC'], ['character', 'name', 'ASC']]
            });

            if (userCharacters.length === 0) {
                const emptyTextDisplay = new TextDisplayBuilder()
                    .setContent(`**${EMOJIS.ERROR} Empty Collection**\n\n${targetUser.username} hasn't collected any characters yet!`);
                return await interaction.editReply({ components: [emptyTextDisplay], flags: MessageFlags.IsComponentsV2 });
            }

            const characters = await Promise.all(userCharacters.map(async uc => {
                const characterData = uc.character.toJSON();
                return {
                    ...characterData,
                    customLevel: uc.customLevel,
                    isFavorite: uc.isFavorite,
                };
            }));

            const cardAlbum = new CardAlbum();
            const albumBuffer = await cardAlbum.generateAlbum(characters, page, {
                id: targetUser.id,
                username: targetUser.username
            });
            const attachment = new AttachmentBuilder(albumBuffer, { name: 'collection.png' });

            const totalPages = Math.ceil(characters.length / 8);
            const startIndex = page * 8;
            const pageCharacters = characters.slice(startIndex, startIndex + 8);

            const generateStars = (rarity) => {
                const starMap = { 'COMMON': '★☆☆☆☆', 'RARE': '★★☆☆☆', 'EPIC': '★★★☆☆', 'LEGENDARY': '★★★★☆', 'MYTHIC': '★★★★★', 'DIMENSIONAL': '★★★★★' };
                return starMap[rarity] || '☆☆☆☆☆';
            };

            let characterList = pageCharacters.map((character, index) => {
                const cardNumber = startIndex + index + 1;
                const favoriteEmoji = character.isFavorite ? '🔥 ' : '';
                const stars = generateStars(character.rarity);
                const levelDisplay = `△${character.customLevel || 1}`;
                return `${favoriteEmoji}\`${character.id}\` · ${stars} · #${cardNumber} · ${levelDisplay} · ${character.anime || 'Unknown'} · ${character.name}`;
            }).join('\n');

            const headerTextDisplay = new TextDisplayBuilder().setContent(`**▷ ${targetUser.username}'s Character Collection**`);
            const characterContainer = new ContainerBuilder()
                .setAccentColor(COLORS.SUCCESS)
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${characters.length}** characters • Page **${page + 1}** of **${totalPages}**\n\n${characterList || 'No characters on this page.'}`));
            
            const mediaGallery = new MediaGalleryBuilder().addItems(mg => mg.setDescription("Collection Album").setURL('attachment://collection.png'));
            
            const buttonRow = new ActionRowBuilder();
            if (totalPages > 1) {
                buttonRow.addComponents(
                    new ButtonBuilder().setCustomId(`collection_prev_${targetUser.id}_${page}`).setLabel('Previous').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
                    new ButtonBuilder().setCustomId(`collection_next_${targetUser.id}_${page}`).setLabel('Next').setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages - 1)
                );
            }

            await interaction.editReply({
                files: [attachment],
                components: [headerTextDisplay, characterContainer, mediaGallery, buttonRow],
                flags: MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Collection command error:', error);
            const errorTextDisplay = new TextDisplayBuilder().setContent(`**${EMOJIS.ERROR} Collection Error**\n\nAn error occurred.`);
            await interaction.editReply({ components: [errorTextDisplay], flags: MessageFlags.IsComponentsV2 });
        }
    }
};

