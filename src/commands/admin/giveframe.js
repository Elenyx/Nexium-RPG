const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { models } = require('../../database/connection');
const { COLORS, EMOJIS, VALID_FRAME_IDS, FRAMES } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveframe')
        .setDescription('[ADMIN] Give a frame to a user for a specific character')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to give frame to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('Character ID to apply frame to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frame_id')
                .setDescription('Frame ID to give')
                .setRequired(true)
                .addChoices(
                    { name: 'Default Frame', value: 'default' },
                    { name: 'Golden Frame', value: 'basic_gold' },
                    { name: 'Silver Frame', value: 'basic_silver' },
                    { name: 'Diamond Frame', value: 'premium_diamond' },
                    { name: 'Platinum Frame', value: 'premium_platinum' },
                    { name: 'Christmas Frame', value: 'seasonal_christmas' },
                    { name: 'Halloween Frame', value: 'seasonal_halloween' }
                )),

    async execute(interaction) {
        // Check if user has administrator permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle(`${EMOJIS.ERROR} Permission Denied`)
                .setDescription('You need Administrator permissions to use this command.')
                .setColor(COLORS.ERROR);
            return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        const targetUser = interaction.options.getUser('user');
        const characterId = interaction.options.getString('character_id');
        const frameId = interaction.options.getString('frame_id');

        try {
            await interaction.deferReply();

            // Check if database is available
            if (!models) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                    .setDescription('The database is not configured.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Check if character exists
            const character = await models.Character.findByPk(characterId);
            if (!character) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Found`)
                    .setDescription(`Character with ID \`${characterId}\` does not exist.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Check if user owns this character
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId: targetUser.id, characterId }
            });

            if (!userCharacter) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Owned`)
                    .setDescription(`${targetUser.username} doesn't own the character \`${character.name}\` (${characterId}).\nUse \`/givecharacter\` first to give them the character.`);

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

            // Get frame details
            const selectedFrame = FRAMES[frameId.toUpperCase()] || FRAMES[Object.keys(FRAMES).find(key => FRAMES[key].id === frameId)];

            // Update the frame in database
            const previousFrameId = userCharacter.frameId;
            await userCharacter.update({ frameId });

            // Verify the update was successful
            await userCharacter.reload();
            if (userCharacter.frameId !== frameId) {
                console.error(`[ERROR] Frame update failed for user ${targetUser.id}, character ${characterId}`);
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Update Failed`)
                    .setDescription('Failed to update the character frame. Please try again.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Log successful frame assignment
            console.log(`[ADMIN] ${interaction.user.username} gave frame '${frameId}' to ${targetUser.username} for character ${characterId}`);

            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Frame Assigned`)
                .setDescription(`Successfully assigned **${selectedFrame.name}** to ${targetUser.username}'s **${character.name}**!`)
                .addFields(
                    { name: 'User', value: targetUser.username, inline: true },
                    { name: 'Character', value: `${character.name} (${characterId})`, inline: true },
                    { name: 'Frame Applied', value: `${selectedFrame.name} (${frameId})`, inline: true },
                    { name: 'Previous Frame', value: previousFrameId || 'Default', inline: true },
                    { name: 'Frame Description', value: selectedFrame.description, inline: false }
                )
                .setFooter({ text: 'Frame changes will be visible when viewing character cards' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Give frame command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Error`)
                .setDescription('An error occurred while assigning the frame.');

            await interaction.editReply({ embeds: [embed] });
        }
    }
};
