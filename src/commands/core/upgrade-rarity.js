const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const CardLevelingService = require('../../services/CardLevelingService');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upgrade-rarity')
        .setDescription('Upgrade a maxed level card to the next rarity tier')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to upgrade')
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

            // Check if character is at max level
            if (userCharacter.customLevel < 100) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Not Max Level`)
                    .setDescription(`${userCharacter.character.name} is not at max level yet!\n**Current Level:** ${userCharacter.customLevel}/100\n\nKeep merging duplicates to reach level 100.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Create CardLevelingService instance
            const cardLevelingService = new CardLevelingService();

            // Check rarity upgrade eligibility
            const upgradeCheck = await cardLevelingService.checkRarityUpgrade(userId, characterId);

            if (!upgradeCheck) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Max Rarity Reached`)
                    .setDescription(`${userCharacter.character.name} is already at the maximum rarity tier!\n\n**Current Rarity:** ${userCharacter.character.rarity}`);

                return await interaction.editReply({ embeds: [embed] });
            }

            if (!upgradeCheck.canUpgrade) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Insufficient Shards`)
                    .setDescription(`You don't have enough shards for the rarity upgrade!\n\n**Required:** ${upgradeCheck.shardCost} shards\n**You have:** ${upgradeCheck.currentShards} shards\n**Need:** ${upgradeCheck.shardsNeeded} more shards`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Perform the rarity upgrade
            const upgradeResult = await cardLevelingService.upgradeRarity(userId, characterId);

            if (!upgradeResult.success) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Upgrade Failed`)
                    .setDescription(upgradeResult.error || 'An error occurred while upgrading the character.');

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
            const rarityEmojis = {
                'COMMON': '⚪',
                'RARE': '🟢',
                'EPIC': '🟣',
                'LEGENDARY': '🟡',
                'MYTHIC': '🔴',
                'DIMENSIONAL': '🌌'
            };

            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Rarity Upgraded!`)
                .setDescription(`**${updatedCharacter.character.name}** has evolved to a higher tier!`);

            embed.addFields(
                {
                    name: '⭐ Rarity Evolution',
                    value: `${rarityEmojis[upgradeResult.oldRarity]} **${upgradeResult.oldRarity}** → ${rarityEmojis[upgradeResult.newRarity]} **${upgradeResult.newRarity}**`,
                    inline: false
                },
                {
                    name: '💎 Cost',
                    value: `**Shards Spent:** ${upgradeResult.shardsSpent}`,
                    inline: true
                },
                {
                    name: '🔄 Reset Stats',
                    value: `**Level:** 1/100\n**EXP:** 0\n**Ready for new growth!**`,
                    inline: true
                }
            );

            // Add new base stats for the upgraded rarity
            const cardLevelingServiceInstance = new CardLevelingService();
            const newStats = cardLevelingServiceInstance.calculateScaledStats(updatedCharacter.character, 1, updatedCharacter);

            embed.addFields({
                name: '⚔️ New Base Stats',
                value: `**Attack:** ${newStats.attack}\n**Defense:** ${newStats.defense}\n**Speed:** ${newStats.speed}\n**Health:** ${newStats.health}`,
                inline: true
            });

            embed.setFooter({
                text: 'Continue merging duplicates to level up your evolved character!'
            });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Upgrade rarity command error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Upgrade Error`)
                .setDescription('An error occurred while upgrading the character.')
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
