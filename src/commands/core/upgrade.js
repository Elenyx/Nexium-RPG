const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const ShardService = require('../../services/ShardService');
const RarityUpgradeService = require('../../services/RarityUpgradeService');
const CardLevelingService = require('../../services/CardLevelingService');
const { COLORS, EMOJIS, RARITY_UPGRADE_THRESHOLDS, LEVEL_CAPS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upgrade')
        .setDescription('Upgrade your characters using shards')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to upgrade')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of upgrade')
                .setRequired(false)
                .addChoices(
                    { name: 'Level Up', value: 'level' },
                    { name: 'Rarity Upgrade', value: 'rarity' }
                ))
        .addIntegerOption(option =>
            option.setName('levels')
                .setDescription('Number of levels to upgrade (1-10, only for level upgrades)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction) {
            const characterId = interaction.options.getString('character_id');
            const upgradeType = interaction.options.getString('type') || 'level';
            const levels = interaction.options.getInteger('levels') || 1;
            const userId = interaction.user.id;

            // Validate upgrade type
            if (!['level', 'rarity'].includes(upgradeType)) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Invalid Upgrade Type`)
                    .setDescription('Upgrade type must be either "level" or "rarity".');
                return await interaction.editReply({ embeds: [embed] });
            }

            // Validate levels for level upgrades
            if (upgradeType === 'level' && (levels < 1 || levels > 10)) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Invalid Level Amount`)
                    .setDescription('Level upgrades must be between 1 and 10 levels.');
                return await interaction.editReply({ embeds: [embed] });
            }        try {
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
            const shardService = new ShardService();
            const rarityUpgradeService = new RarityUpgradeService();

            // Get user data
            const user = await userService.getOrCreateUser(userId, interaction.user.username);

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
            const currentLevel = userCharacter.customLevel;

            // Check if character is already at max level
            if (currentLevel >= 100) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.WARNING)
                    .setTitle(`${EMOJIS.WARNING} Max Level Reached`)
                    .setDescription(`${character.name} is already at max level (100)!\n\nUse \`/upgrade-rarity\` to upgrade to the next rarity tier.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            if (upgradeType === 'rarity') {
                // Handle rarity upgrade
                return await this.handleRarityUpgrade(interaction, user, userCharacter, character, rarityUpgradeService);
            } else {
                // Handle level upgrade (existing logic)
                return await this.handleLevelUpgrade(interaction, user, userCharacter, character, levels, shardService, rarityUpgradeService);
            }

            // Check if user has enough shards
            if (user.shards < totalCost) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Insufficient Shards`)
                    .setDescription(`You need **${totalCost.toLocaleString()}** ${EMOJIS.SHARD || '💎'} shards to upgrade ${levels} level${levels > 1 ? 's' : ''}.\nYou have **${user.shards.toLocaleString()}** shards.`)
                    .addFields({
                        name: '💡 How to get shards',
                        value: '• Complete Main Story Quests\n• Daily quests and challenges\n• Special events'
                    });
                return await interaction.editReply({ embeds: [embed] });
            }

            // Check if upgrade would exceed max level (100)
            const maxLevel = 100;
            if (currentLevel + levels > maxLevel) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.WARNING)
                    .setTitle(`${EMOJIS.WARNING} Level Cap Reached`)
                    .setDescription(`Cannot upgrade beyond level ${maxLevel}.\nCurrent level: ${currentLevel}\nMaximum upgrade: ${maxLevel - currentLevel} levels.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            // Perform the upgrade
            const upgradeResult = await rarityUpgradeService.upgradeCharacter(userId, characterId, upgradeType, levels);

            if (!upgradeResult.success) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Upgrade Failed`)
                    .setDescription(upgradeResult.error || 'An error occurred while upgrading the character.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Display detailed feedback
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Upgrade Successful`)
                .setDescription(`Successfully upgraded character!`)
                .addFields(
                    { name: 'Upgrade Type', value: `${upgradeType === 'level' ? 'Level Up' : 'Rarity Upgrade'}`, inline: true },
                    { name: 'New Level', value: `${upgradeResult.newLevel || 'N/A'}`, inline: true },
                    { name: 'New Rarity', value: `${upgradeResult.newRarity || 'N/A'}`, inline: true },
                    { name: 'New Stats', value: `Attack: ${upgradeResult.newStats.attack}\nDefense: ${upgradeResult.newStats.defense}\nSpeed: ${upgradeResult.newStats.speed}\nHealth: ${upgradeResult.newStats.health}` }
                );

            return await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Upgrade command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Upgrade Error`)
                .setDescription('An error occurred while upgrading your character.');

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [embed] });
            } else {
                await interaction.reply({
                    embeds: [embed],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },

    async handleRarityUpgrade(interaction, user, userCharacter, character, rarityUpgradeService) {
        const progress = await rarityUpgradeService.getRarityUpgradeProgress(user.id, character.id);

        if (!progress) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Progress Not Found`)
                .setDescription('Unable to retrieve rarity upgrade progress.');
            return await interaction.editReply({ embeds: [embed] });
        }

        if (!progress.nextRarity) {
            const group = rarityUpgradeService.getRarityGroup(character.rarity);
            const levelCap = rarityUpgradeService.getLevelCapForRarity(character.rarity);
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Maximum Rarity Reached!`)
                .setDescription(`${character.name} has reached the maximum rarity for their group (**${character.rarity}**).`)
                .addFields({
                    name: '🎯 Next Steps',
                    value: `Switch to **level upgrades** to continue improving your character!\nLevel cap for ${group} group: **${levelCap}**`,
                    inline: false
                }, {
                    name: '💡 Level Up Benefits',
                    value: '• Increased stats with each level\n• Higher damage and defense\n• Better performance in battles\n• Unlock special abilities at higher levels'
                });
            return await interaction.editReply({ embeds: [embed] });
        }

        if (!progress.canUpgrade) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.WARNING)
                .setTitle(`${EMOJIS.WARNING} Insufficient Shards`)
                .setDescription(`You need **${progress.requiredShards.toLocaleString()}** ${EMOJIS.SHARD} shards to upgrade ${character.name} from ${progress.currentRarity} to ${progress.nextRarity}.\nYou have collected **${progress.collectedShards.toLocaleString()}** shards.`)
                .addFields({
                    name: '📊 Progress',
                    value: `${'█'.repeat(Math.floor(progress.progress / 10))}${'░'.repeat(10 - Math.floor(progress.progress / 10))} ${progress.progress.toFixed(1)}%`,
                    inline: false
                }, {
                    name: '💡 How to get more shards',
                    value: '• Complete Main Story Quests\n• Daily quests and challenges\n• Special events\n• Level up characters'
                });
            return await interaction.editReply({ embeds: [embed] });
        }

        // Perform the rarity upgrade
        const upgradeResult = await rarityUpgradeService.performRarityUpgrade(user.id, character.id);

        if (!upgradeResult) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Upgrade Failed`)
                .setDescription('Failed to perform rarity upgrade.');
            return await interaction.editReply({ embeds: [embed] });
        }

        // Create success embed
        const embed = new EmbedBuilder()
            .setColor(COLORS.SUCCESS)
            .setTitle(`${EMOJIS.SUCCESS} Rarity Upgraded!`)
            .setDescription(`Successfully upgraded **${character.name}**!`)
            .addFields(
                {
                    name: '⭐ Rarity Progress',
                    value: `**${upgradeResult.oldRarity}** → **${upgradeResult.newRarity}**`,
                    inline: true
                },
                {
                    name: '💎 Shards Used',
                    value: upgradeResult.shardsUsed.toLocaleString(),
                    inline: true
                },
                {
                    name: '📈 Stat Improvements',
                    value: [
                        `⚔️ Attack: ${upgradeResult.oldStats.attack} → ${upgradeResult.newStats.attack} (+${upgradeResult.newStats.attack - upgradeResult.oldStats.attack})`,
                        `🛡️ Defense: ${upgradeResult.oldStats.defense} → ${upgradeResult.newStats.defense} (+${upgradeResult.newStats.defense - upgradeResult.oldStats.defense})`,
                        `💨 Speed: ${upgradeResult.oldStats.speed} → ${upgradeResult.newStats.speed} (+${upgradeResult.newStats.speed - upgradeResult.oldStats.speed})`,
                        `❤️ Health: ${upgradeResult.oldStats.health} → ${upgradeResult.newStats.health} (+${upgradeResult.newStats.health - upgradeResult.oldStats.health})`
                    ].join('\n'),
                    inline: false
                }
            )
            .setFooter({
                text: `Remaining shards: ${(user.shards - upgradeResult.shardsUsed).toLocaleString()}`
            })
            .setTimestamp();

        // Check if this upgrade reached the max for their group
        const nextRarityAfterUpgrade = rarityUpgradeService.getNextRarity(upgradeResult.newRarity);
        if (!nextRarityAfterUpgrade) {
            const group = rarityUpgradeService.getRarityGroup(upgradeResult.newRarity);
            const levelCap = rarityUpgradeService.getLevelCapForRarity(upgradeResult.newRarity);
            embed.addFields({
                name: '🎯 Ready for Level Ups!',
                value: `You've reached the maximum rarity for the ${group} group!\nNow focus on **level upgrades** (up to level ${levelCap}).`,
                inline: false
            });
        }

        await interaction.editReply({ embeds: [embed] });
    },

    async handleLevelUpgrade(interaction, user, userCharacter, character, levels, shardService, rarityUpgradeService) {
        const currentLevel = userCharacter.customLevel;
        const currentExp = userCharacter.customExp;

        // Calculate EXP to add based on levels requested
        // Each level requires progressively more EXP, so we'll add enough EXP for the requested levels
        const cardLevelingService = new CardLevelingService();
        let totalExpNeeded = 0;

        for (let i = 0; i < levels; i++) {
            const targetLevel = currentLevel + i + 1;
            if (targetLevel <= 100) {
                totalExpNeeded += cardLevelingService.levelExpRequirements[targetLevel] - cardLevelingService.levelExpRequirements[targetLevel - 1];
            }
        }

        // Calculate shard cost (1 shard = 10 EXP)
        const shardCost = Math.ceil(totalExpNeeded / 10);

        // Check if user has enough shards
        if (user.shards < shardCost) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Insufficient Shards`)
                .setDescription(`You need **${shardCost.toLocaleString()}** ${EMOJIS.SHARD || '💎'} shards to gain **${totalExpNeeded.toLocaleString()}** EXP.\nYou have **${user.shards.toLocaleString()}** shards.`)
                .addFields({
                    name: '💡 How to get shards',
                    value: '• Complete Main Story Quests\n• Daily quests and challenges\n• Special events\n• Merge duplicate cards'
                });
            return await interaction.editReply({ embeds: [embed] });
        }

        // Check if character is already at max level
        if (currentLevel >= 100) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.WARNING)
                .setTitle(`${EMOJIS.WARNING} Max Level Reached`)
                .setDescription(`${character.name} is already at max level (100)!\n\nUse \`/upgrade-rarity\` to upgrade to the next rarity tier.`);
            return await interaction.editReply({ embeds: [embed] });
        }

        // Add EXP to the character
        const levelingResult = await cardLevelingService.addExpToCard(user.id, character.id, totalExpNeeded);

        // Deduct shards
        await shardService.removeShards(user.id, shardCost, `EXP boost: ${character.name} +${totalExpNeeded} EXP`);

        // Get updated character info
        const updatedUserCharacter = await models.UserCharacter.findOne({
            where: { userId: user.id, characterId: character.id },
            include: [{
                model: models.Character,
                as: 'character'
            }]
        });

        // Calculate stat improvements
        const oldStats = cardLevelingService.calculateScaledStats(character, currentLevel);
        const newStats = cardLevelingService.calculateScaledStats(character, levelingResult.newLevel);

        // Create success embed
        const embed = new EmbedBuilder()
            .setColor(COLORS.SUCCESS)
            .setTitle(`${EMOJIS.SUCCESS} Character Enhanced!`)
            .setDescription(`Successfully boosted **${character.name}** with EXP!`)
            .addFields(
                {
                    name: '📊 Level Progress',
                    value: levelingResult.leveledUp
                        ? `**${currentLevel}** → **${levelingResult.newLevel}** (+${levelingResult.levelsGained} levels)`
                        : `**${levelingResult.newLevel}** (no level up yet)`,
                    inline: true
                },
                {
                    name: '✨ EXP Gained',
                    value: `**+${totalExpNeeded.toLocaleString()}** EXP\n**${levelingResult.newExp.toLocaleString()}** total EXP`,
                    inline: true
                },
                {
                    name: '💎 Shards Spent',
                    value: shardCost.toLocaleString(),
                    inline: true
                }
            );

        // Add stat improvements if leveled up
        if (levelingResult.leveledUp) {
            embed.addFields({
                name: '📈 Stat Improvements',
                value: [
                    `⚔️ Attack: ${oldStats.attack} → ${newStats.attack} (+${newStats.attack - oldStats.attack})`,
                    `🛡️ Defense: ${oldStats.defense} → ${newStats.defense} (+${newStats.defense - oldStats.defense})`,
                    `💨 Speed: ${oldStats.speed} → ${newStats.speed} (+${newStats.speed - oldStats.speed})`,
                    `❤️ Health: ${oldStats.health} → ${newStats.health} (+${newStats.health - oldStats.health})`
                ].join('\n'),
                inline: false
            });
        }

        // Add rarity upgrade info if available
        if (levelingResult.rarityUpgrade) {
            const upgrade = levelingResult.rarityUpgrade;
            if (upgrade.canUpgrade) {
                embed.addFields({
                    name: '⭐ Rarity Upgrade Available!',
                    value: `**Next Rarity:** ${upgrade.nextRarity}\n**Cost:** ${upgrade.shardCost} shards\nUse \`/upgrade-rarity\` to upgrade!`,
                    inline: false
                });
            }
        }

        embed.setFooter({
            text: `Remaining shards: ${(user.shards - shardCost).toLocaleString()} | Use /merge to get more EXP from duplicates`
        });

        // Add upgrade again button if more upgrades are possible
        const components = [];
        if (levelingResult.newLevel < 100) {
            const nextExpNeeded = cardLevelingService.levelExpRequirements[levelingResult.newLevel + 1] - levelingResult.newExp;
            const nextShardCost = Math.ceil(nextExpNeeded / 10);
            const canAfford = (user.shards - shardCost) >= nextShardCost;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`exp_boost_${character.id}_${levelingResult.newLevel}`)
                        .setLabel(`Boost EXP (${nextShardCost} shards)`)
                        .setStyle(canAfford ? ButtonStyle.Primary : ButtonStyle.Secondary)
                        .setDisabled(!canAfford)
                        .setEmoji({ name: '✨' })
                );

            components.push(row);
        }

        await interaction.editReply({ embeds: [embed], components });
    }
};
