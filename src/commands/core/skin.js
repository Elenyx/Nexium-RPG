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
                // Log the attempt for security monitoring
                console.warn(`[SECURITY] User ${userId} (${interaction.user.username}) attempted to change frame for unowned character ${characterId}`);

                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Owned`)
                    .setDescription(`You don't own the character \`${character.name}\` (${characterId}).\nUse \`/pull\` to get new characters or \`/collection\` to see your owned characters.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Double-check ownership by ensuring the record belongs to the current user
            if (userCharacter.userId !== userId) {
                console.error(`[SECURITY] Ownership validation failed for user ${userId} on character ${characterId}`);
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Access Denied`)
                    .setDescription('You do not have permission to modify this character.');

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

            // Get frame details for validation
            const selectedFrame = FRAMES[frameId.toUpperCase()] || FRAMES[Object.keys(FRAMES).find(key => FRAMES[key].id === frameId)];

            // Additional validation: Check if frame is obtainable (basic validation)
            if (selectedFrame && selectedFrame.obtainable === 'event') {
                // For event frames, you might want to add additional checks here
                // For now, we'll allow them but you could add event participation checks
                console.log(`[FRAME] User ${userId} using event frame: ${frameId}`);
            }

            // Update the frame in database
            const previousFrameId = userCharacter.frameId;
            await userCharacter.update({ frameId });

            // Verify the update was successful
            await userCharacter.reload();
            if (userCharacter.frameId !== frameId) {
                console.error(`[ERROR] Frame update failed for user ${userId}, character ${characterId}`);
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Update Failed`)
                    .setDescription('Failed to update the character frame. Please try again.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Log successful frame change
            console.log(`[SKIN] User ${userId} changed frame for character ${characterId} from '${previousFrameId || 'default'}' to '${frameId}'`);

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
