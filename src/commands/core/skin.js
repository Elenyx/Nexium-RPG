const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const { COLORS, EMOJIS, VALID_FRAME_IDS, FRAMES } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skin')
        .setDescription('Change the frame of a character card')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to change frame')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frame_id')
                .setDescription('ID of the frame to apply')
                .setRequired(true)),

    async execute(interaction) {
        const characterId = interaction.options.getString('character_id');
        const frameId = interaction.options.getString('frame_id');
        const userId = interaction.user.id;

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

            // Check if user owns this character
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId }
            });

            if (!userCharacter) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Owned`)
                    .setDescription(`You don't own the character \`${character.name}\` (${characterId}).\nUse \`/pull\` to get new characters or \`/collection\` to see your owned characters.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Validate frame ID
            if (!VALID_FRAME_IDS.includes(frameId)) {
                const availableFrames = VALID_FRAME_IDS.map(id => `\`${id}\``).join(', ');
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Invalid Frame ID`)
                    .setDescription(`\`${frameId}\` is not a valid frame ID.\n\n**Available Frames:**\n${availableFrames}`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Update the frame in database
            await userCharacter.update({ frameId });

            // Success response
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Frame Changed`)
                .setDescription(`Successfully changed the frame for **${character.name}** (${characterId}) to **${selectedFrame.name}**.`)
                .addFields(
                    { name: 'Character', value: character.name, inline: true },
                    { name: 'Previous Frame', value: userCharacter.frameId || 'Default', inline: true },
                    { name: 'New Frame', value: `${selectedFrame.name} (${frameId})`, inline: true },
                    { name: 'Frame Description', value: selectedFrame.description, inline: false }
                )
                .setFooter({ text: 'Frame changes will be visible when viewing character cards' });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in skin command:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Command Failed`)
                .setDescription('An error occurred while processing your request. Please try again later.');

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }
        }
    },
};
