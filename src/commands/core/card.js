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
            const cardRenderer = new CharacterCardRenderer();
            const framedCardUrl = await cardRenderer.renderCardUrl(character.toJSON());

            let cardBuffer;
            try {
                // Check if the returned value is a URL, base64 data URL, or local file path
                if (framedCardUrl.startsWith('data:image/')) {
                    // It's a base64 data URL from canvas
                    const base64Data = framedCardUrl.split(',')[1];
                    cardBuffer = Buffer.from(base64Data, 'base64');
                } else if (framedCardUrl.startsWith('http://') || framedCardUrl.startsWith('https://')) {
                    // It's a URL, fetch with axios
                    const response = await axios.get(framedCardUrl, { responseType: 'arraybuffer' });
                    cardBuffer = Buffer.from(response.data, 'binary');
                } else {
                    // Invalid path, generate simple canvas card
                    throw new Error('Invalid image path returned');
                }
            } catch (error) {
                console.warn('Error loading character card, generating simple fallback:', error.message);
                // Generate a simple canvas card as fallback
                const { createCanvas } = require('canvas');
                const canvas = createCanvas(400, 560);
                const ctx = canvas.getContext('2d');
                
                // Draw background with rarity color
                const rarityColors = {
                    'COMMON': '#9CA3AF', 'RARE': '#3B82F6', 'EPIC': '#8B5CF6',
                    'LEGENDARY': '#F59E0B', 'MYTHIC': '#EF4444', 'DIMENSIONAL': '#7C3AED'
                };
                ctx.fillStyle = rarityColors[character.rarity] || '#9CA3AF';
                ctx.fillRect(0, 0, 400, 560);
                
                // Draw character name
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(character.name, 200, 300);
                ctx.font = '18px Arial';
                ctx.fillText(character.rarity, 200, 330);
                
                cardBuffer = canvas.toBuffer('image/png');
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

