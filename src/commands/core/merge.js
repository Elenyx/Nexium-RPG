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

            // Get updated character info
            const updatedCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }]
            });

            // Create success embed
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Card Merged Successfully!`)
                .setDescription(`**${updatedCharacter.character.name}** has been enhanced!`);

            // Add merge details
            embed.addFields(
                {
                    name: '🔄 Merge Details',
                    value: `**EXP Gained:** ${mergeResult.expGained}\n**Duplicate Level:** ${duplicateLevel}`,
                    inline: true
                }
            );

            // Add leveling information
            if (mergeResult.leveledUp) {
                embed.addFields({
                    name: '⬆️ Level Up!',
                    value: `**Level:** ${mergeResult.newLevel - mergeResult.levelsGained} → **${mergeResult.newLevel}**\n**Levels Gained:** ${mergeResult.levelsGained}`,
                    inline: true
                });
            } else {
                embed.addFields({
                    name: '📊 Current Progress',
                    value: `**Level:** ${mergeResult.newLevel}\n**EXP:** ${mergeResult.newExp}`,
                    inline: true
                });
            }

            // Add rarity upgrade information if available
            if (mergeResult.rarityUpgrade) {
                const upgrade = mergeResult.rarityUpgrade;
                if (upgrade.canUpgrade) {
                    embed.addFields({
                        name: '⭐ Rarity Upgrade Available!',
                        value: `**Next Rarity:** ${upgrade.nextRarity}\n**Cost:** ${upgrade.shardCost} shards\n**Your Shards:** ${upgrade.currentShards}`,
                        inline: false
                    });
                } else {
                    embed.addFields({
                        name: '⭐ Rarity Upgrade',
                        value: `**Next Rarity:** ${upgrade.nextRarity}\n**Cost:** ${upgrade.shardCost} shards\n**Need:** ${upgrade.shardsNeeded} more shards`,
                        inline: false
                    });
                }
            }

            // Add current stats
            const scaledStats = cardLevelingService.calculateScaledStats(updatedCharacter.character, updatedCharacter.customLevel, updatedCharacter);
            embed.addFields({
                name: '⚔️ Current Stats',
                value: `**Attack:** ${scaledStats.attack}\n**Defense:** ${scaledStats.defense}\n**Speed:** ${scaledStats.speed}\n**Health:** ${scaledStats.health}`,
                inline: true
            });

            embed.setFooter({
                text: 'Use /upgrade to level up further or /rarity-progress to check upgrade requirements'
            });

            await interaction.editReply({ embeds: [embed] });

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
