const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { User, Character, UserCharacter } = require('../../database/models');
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

            // Get user's characters from database
            const userCharacters = await UserCharacter.findAll({
                where: { userId: targetUser.id },
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

                return await interaction.editReply({ embeds: [embed] });
            }

            // Transform data for CardAlbum
            const characters = userCharacters.map(uc => ({
                id: uc.character.id,
                name: uc.character.name,
                rarity: uc.character.rarity,
                imagePath: uc.character.imagePath
            }));

            // Generate the card album image
            const cardAlbum = new CardAlbum();
            const albumBuffer = await cardAlbum.generateAlbum(characters, page, {
                id: targetUser.id,
                username: targetUser.username
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

            // Add navigation buttons if there are multiple pages
            const components = [];
            if (totalPages > 1) {
                const row = new ActionRowBuilder()
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
            console.error('Collection command error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Collection Error`)
                .setDescription('An error occurred while generating your collection album.')
                .setFooter({ text: 'Please try again later' });

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({
                    embeds: [errorEmbed],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};
