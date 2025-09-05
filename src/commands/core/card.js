const { SlashCommandBuilder, EmbedBuilder, MessageFlags, AttachmentBuilder } = require('discord.js');
const { models } = require('../../database/connection');
const { COLORS, EMOJIS } = require('../../config/constants');
const CharacterCardRenderer = require('../../services/CharacterCardRenderer'); // Import the new renderer
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('View a specific character card by ID')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to view')
                .setRequired(true)),

    async execute(interaction) {
        const characterId = interaction.options.getString('character_id');
        const userId = interaction.user.id;

        try {
            await interaction.deferReply();

            if (!models) {
                const embed = new EmbedBuilder().setColor(COLORS.ERROR).setTitle(`${EMOJIS.ERROR} Database Unavailable`).setDescription('The database is not configured.');
                return await interaction.editReply({ embeds: [embed] });
            }

            const character = await models.Character.findByPk(characterId);

            if (!character) {
                const embed = new EmbedBuilder().setColor(COLORS.ERROR).setTitle(`${EMOJIS.ERROR} Character Not Found`).setDescription(`No character found with ID \`${characterId}\`.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            // Generate the framed card URL using our new renderer
            const framedCardUrl = CharacterCardRenderer.renderCardUrl(character.toJSON());

            let cardBuffer;
            try {
                // Fetch the image from the URL to attach it to the Discord message
                const response = await axios.get(framedCardUrl, { responseType: 'arraybuffer' });
                cardBuffer = Buffer.from(response.data, 'binary');
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    // ImageKit account suspended, use local fallback
                    console.warn('ImageKit account suspended, using local fallback image');
                    const fs = require('fs');
                    const path = require('path');
                    const fallbackPath = path.join(__dirname, '../../tests/test-fallback-card.png');
                    cardBuffer = fs.readFileSync(fallbackPath);
                } else {
                    throw error; // Re-throw other errors
                }
            }
            const attachment = new AttachmentBuilder(cardBuffer, { name: 'character-card.png' });
            
            const userCharacter = await models.UserCharacter.findOne({ where: { userId, characterId } });
            const ownsCharacter = !!userCharacter;

            const rarityColor = COLORS[character.rarity] || COLORS.PRIMARY;

            const embed = new EmbedBuilder()
                .setColor(rarityColor)
                .setTitle(`${character.name}`)
                .setImage('attachment://character-card.png')
                .setTimestamp();

            let description = `**ID:** \`${character.id}\`\n**Anime:** ${character.anime}\n**Rarity:** ${character.rarity}`;
            description += ownsCharacter ? `\n\n${EMOJIS.SUCCESS} **Owned**` : `\n\n${EMOJIS.ERROR} **Not Owned**`;
            
            // (You can add your other description logic for stats etc. here)

            embed.setDescription(description);

            await interaction.editReply({
                embeds: [embed],
                files: [attachment]
            });

        } catch (error) {
            console.error('Card command error:', error);
            const errorEmbed = new EmbedBuilder().setColor(COLORS.ERROR).setTitle(`${EMOJIS.ERROR} Card Error`).setDescription('An error occurred while generating the card.');
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed], files: [] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
            }
        }
    }
};

