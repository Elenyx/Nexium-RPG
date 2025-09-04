const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const CardLevelingService = require('../../services/CardLevelingService');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('merge')
        .setDescription('Merge duplicate cards to level up your characters')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to merge duplicates into')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duplicate_level')
                .setDescription('Level of the duplicate card being merged (1-100)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(100)),

    async execute(interaction) {
        const characterId = interaction.options.getString('character_id');
        const duplicateLevel = interaction.options.getInteger('duplicate_level') || 1;
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

            // Check if user owns the character
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }]
            });

            if (!userCharacter) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Owned`)
                    .setDescription(`You don't own a character with ID \`${characterId}\`.\nUse \`/collection\` to see your characters and their IDs.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Validate duplicate level input
            if (duplicateLevel < 1 || duplicateLevel > 100) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Invalid Duplicate Level`)
                    .setDescription('Duplicate level must be between 1 and 100.');
                return await interaction.editReply({ embeds: [embed] });
            }

            // Note: In a production system, you might want to add validation to ensure
            // the user actually has duplicate cards to merge. For now, we trust the input
            // but this could be enhanced with inventory tracking.

            // Perform the merge
            const mergeResult = await cardLevelingService.mergeDuplicateCard(userId, characterId, duplicateLevel);

            if (!mergeResult.success) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Merge Failed`)
                    .setDescription(mergeResult.error || 'An error occurred while merging the card.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Display detailed feedback
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Merge Successful`)
                .setDescription(`Successfully merged duplicate card!`)
                .addFields(
                    { name: 'EXP Gained', value: `${mergeResult.expGained}`, inline: true },
                    { name: 'New Level', value: `${mergeResult.newLevel}`, inline: true },
                    { name: 'Levels Gained', value: `${mergeResult.levelsGained}`, inline: true },
                    { name: 'New Stats', value: `Attack: ${mergeResult.newStats.attack}\nDefense: ${mergeResult.newStats.defense}\nSpeed: ${mergeResult.newStats.speed}\nHealth: ${mergeResult.newStats.health}` }
                );

            return await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Merge command error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Merge Error`)
                .setDescription('An error occurred while merging the card.')
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
