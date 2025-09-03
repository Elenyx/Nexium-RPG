const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const RarityUpgradeService = require('../../services/RarityUpgradeService');
const { COLORS, EMOJIS, RARITY_GROUPS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rarity-progress')
        .setDescription('Check rarity upgrade progress for a character')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to check')
                .setRequired(true)),

    async execute(interaction) {
        const characterId = interaction.options.getString('character_id');
        const userId = interaction.user.id;

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

            const userService = new UserService();
            const rarityUpgradeService = new RarityUpgradeService();

            // Get user's character
            const userCharacters = await userService.getUserCharacters(userId);
            const userCharacter = userCharacters.find(uc => uc.character.id === characterId);

            if (!userCharacter) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Found`)
                    .setDescription(`You don't own a character with ID \`${characterId}\`.\nUse \`/collection\` to see your characters and their IDs.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            const character = userCharacter.character;
            const progress = await rarityUpgradeService.getRarityUpgradeProgress(userId, characterId);
            const group = rarityUpgradeService.getRarityGroup(character.rarity);
            const levelCap = rarityUpgradeService.getLevelCapForRarity(character.rarity);

            if (!progress) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Progress Not Found`)
                    .setDescription('Unable to retrieve rarity upgrade progress.');
                return await interaction.editReply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor(COLORS[character.rarity] || COLORS.COMMON)
                .setTitle(`${EMOJIS.UPGRADE} Rarity Upgrade Progress`)
                .setDescription(`**${character.name}** (${character.rarity})`)
                .addFields(
                    {
                        name: '🏷️ Rarity Group',
                        value: group === 'BASIC' ? 'Common → Rare → Epic' : group === 'ADVANCED' ? 'Legendary → Mythic' : 'Special',
                        inline: true
                    },
                    {
                        name: '📊 Current Progress',
                        value: progress.nextRarity
                            ? `${progress.collectedShards.toLocaleString()}/${progress.requiredShards.toLocaleString()} shards`
                            : 'Maximum rarity reached!',
                        inline: true
                    },
                    {
                        name: '🎯 Next Tier',
                        value: progress.nextRarity || 'None (Switch to Level Ups)',
                        inline: true
                    },
                    {
                        name: '📈 Progress Bar',
                        value: progress.nextRarity
                            ? `${'█'.repeat(Math.floor(progress.progress / 10))}${'░'.repeat(10 - Math.floor(progress.progress / 10))} ${progress.progress.toFixed(1)}%`
                            : 'Complete! Ready for Level System',
                        inline: false
                    }
                );

            // Add level information
            if (!progress.nextRarity) {
                embed.addFields({
                    name: '⬆️ Level System Available',
                    value: `Current Level: **${userCharacter.customLevel}/${levelCap}**\nUse \`/upgrade\` with type: level to continue improving!`,
                    inline: false
                });
            }

            embed.setFooter({
                text: progress.canUpgrade
                    ? 'Ready for upgrade! Use /upgrade with type: rarity'
                    : progress.nextRarity
                        ? `Need ${progress.requiredShards - progress.collectedShards} more shards`
                        : `Max rarity reached! Focus on leveling (Level ${userCharacter.customLevel}/${levelCap})`
            })
            .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Rarity progress command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Error`)
                .setDescription('An error occurred while checking rarity progress.');

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({
                    embeds: [embed],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};
