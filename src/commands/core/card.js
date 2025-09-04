const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const PullImageGenerator = require('../../services/PullImageGenerator');
const { COLORS, EMOJIS } = require('../../config/constants');

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

        try {
            await interaction.deferReply();

            // Check if database is available
            if (!models) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                    .setDescription('The database is not configured. Please check your environment variables.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Find the character in the database
            const character = await models.Character.findByPk(characterId);

            if (!character) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Found`)
                    .setDescription(`No character found with ID \`${characterId}\`.\nUse \`/collection\` to see available characters and their IDs.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Generate the character card image (450x600)
            const pullImageGenerator = new PullImageGenerator();
            const cardBuffer = await pullImageGenerator.generateCharacterCard(character, 450, 600);

            // Get rarity color and emoji
            const rarityColors = {
                'COMMON': '#9CA3AF',
                'RARE': '#3B82F6',
                'EPIC': '#8B5CF6',
                'LEGENDARY': '#F59E0B',
                'MYTHIC': '#EF4444',
                'DIMENSIONAL': '#7C3AED'
            };

            const rarityEmojis = {
                'COMMON': '⚪',
                'RARE': '🟢',
                'EPIC': '🟣',
                'LEGENDARY': '🟡',
                'MYTHIC': '🔴',
                'DIMENSIONAL': '🌌'
            };

            // Create embed with character information
            const embed = new EmbedBuilder()
                .setColor(rarityColors[character.rarity] || COLORS.PRIMARY)
                .setTitle(`${rarityEmojis[character.rarity] || '🎴'} ${character.name}`)
                .setDescription(`**ID:** \`${character.id}\`\n**Rarity:** ${character.rarity}`)
                .setImage('attachment://character-card.png')
                .setFooter({ text: 'Use /collection to see all your characters' })
                .setTimestamp();

            // Add additional character info if available
            if (character.description) {
                embed.setDescription(`**ID:** \`${character.id}\`\n**Rarity:** ${character.rarity}\n\n${character.description}`);
            }

            await interaction.editReply({
                embeds: [embed],
                files: [{
                    attachment: cardBuffer,
                    name: 'character-card.png'
                }]
            });

        } catch (error) {
            console.error('Card command error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Card Error`)
                .setDescription('An error occurred while generating the character card.')
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
