const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const ShardService = require('../../services/ShardService');
const RarityUpgradeService = require('../../services/RarityUpgradeService');
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

            // Check if upgrade would exceed max level (50 for now)
            const maxLevel = 50;
            if (currentLevel + levels > maxLevel) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.WARNING)
                    .setTitle(`${EMOJIS.WARNING} Level Cap Reached`)
                    .setDescription(`Cannot upgrade beyond level ${maxLevel}.\nCurrent level: ${currentLevel}\nMaximum upgrade: ${maxLevel - currentLevel} levels.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            // Perform upgrade
            const newLevel = currentLevel + levels;
            await models.UserCharacter.update(
                { customLevel: newLevel },
                { where: { userId, characterId } }
            );

            // Deduct shards
            await shardService.removeShards(userId, totalCost, `Character upgrade: ${character.name} to level ${newLevel}`);

            // Calculate stat improvements
            const oldStats = {
                attack: Math.floor(character.attack * (1 + (currentLevel - 1) * 0.1)),
                defense: Math.floor(character.defense * (1 + (currentLevel - 1) * 0.1)),
                speed: Math.floor(character.speed * (1 + (currentLevel - 1) * 0.1)),
                health: Math.floor(character.health * (1 + (currentLevel - 1) * 0.1))
            };

            const newStats = {
                attack: Math.floor(character.attack * (1 + (newLevel - 1) * 0.1)),
                defense: Math.floor(character.defense * (1 + (newLevel - 1) * 0.1)),
                speed: Math.floor(character.speed * (1 + (newLevel - 1) * 0.1)),
                health: Math.floor(character.health * (1 + (newLevel - 1) * 0.1))
            };

            // Create success embed
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Character Upgraded!`)
                .setDescription(`Successfully upgraded **${character.name}**!`)
                .addFields(
                    {
                        name: '📊 Level Progress',
                        value: `**${currentLevel}** → **${newLevel}**`,
                        inline: true
                    },
                    {
                        name: '💎 Shards Spent',
                        value: totalCost.toLocaleString(),
                        inline: true
                    },
                    {
                        name: '📈 Stat Improvements',
                        value: [
                            `⚔️ Attack: ${oldStats.attack} → ${newStats.attack} (+${newStats.attack - oldStats.attack})`,
                            `🛡️ Defense: ${oldStats.defense} → ${newStats.defense} (+${newStats.defense - oldStats.defense})`,
                            `💨 Speed: ${oldStats.speed} → ${newStats.speed} (+${newStats.speed - oldStats.speed})`,
                            `❤️ Health: ${oldStats.health} → ${newStats.health} (+${newStats.health - oldStats.health})`
                        ].join('\n'),
                        inline: false
                    }
                )
                .setFooter({
                    text: `Remaining shards: ${(user.shards - totalCost).toLocaleString()}`
                })
                .setTimestamp();

            // Add upgrade again button if more upgrades are possible
            const components = [];
            if (newLevel < maxLevel) {
                const nextCost = shardService.getUpgradeCost(character.rarity, newLevel);
                const canAfford = (user.shards - totalCost) >= nextCost;

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`upgrade_${characterId}_${newLevel}`)
                            .setLabel(`Upgrade to Level ${newLevel + 1}`)
                            .setStyle(canAfford ? ButtonStyle.Primary : ButtonStyle.Secondary)
                            .setDisabled(!canAfford)
                            .setEmoji('⬆️')
                    );

                if (!canAfford) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId('get_shards')
                            .setLabel(`Need ${nextCost} Shards`)
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://discord.com/channels/@me') // Placeholder
                    );
                }

                components.push(row);
            }

            await interaction.editReply({ embeds: [embed], components });

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

        // Get level cap based on character's rarity group
        const maxLevel = rarityUpgradeService.getLevelCapForRarity(character.rarity);

        // Calculate upgrade cost
        const totalCost = shardService.getTotalUpgradeCost(character.rarity, currentLevel, currentLevel + levels);

        // Perform upgrade
        const newLevel = currentLevel + levels;
        await models.UserCharacter.update(
            { customLevel: newLevel },
            { where: { userId: user.id, characterId: character.id } }
        );

        // Deduct shards
        await shardService.removeShards(user.id, totalCost, `Character upgrade: ${character.name} to level ${newLevel}`);

        // Add some shards to rarity upgrade progress (10% of upgrade cost)
        const shardsForRarity = Math.floor(totalCost * 0.1);
        if (shardsForRarity > 0) {
            await rarityUpgradeService.addShardsToRarityUpgrade(user.id, character.id, shardsForRarity);
        }

        // Calculate stat improvements
        const oldStats = {
            attack: Math.floor(character.attack * (1 + (currentLevel - 1) * 0.1)),
            defense: Math.floor(character.defense * (1 + (currentLevel - 1) * 0.1)),
            speed: Math.floor(character.speed * (1 + (currentLevel - 1) * 0.1)),
            health: Math.floor(character.health * (1 + (currentLevel - 1) * 0.1))
        };

        const newStats = {
            attack: Math.floor(character.attack * (1 + (newLevel - 1) * 0.1)),
            defense: Math.floor(character.defense * (1 + (newLevel - 1) * 0.1)),
            speed: Math.floor(character.speed * (1 + (newLevel - 1) * 0.1)),
            health: Math.floor(character.health * (1 + (newLevel - 1) * 0.1))
        };

        // Create success embed
        const embed = new EmbedBuilder()
            .setColor(COLORS.SUCCESS)
            .setTitle(`${EMOJIS.SUCCESS} Character Upgraded!`)
            .setDescription(`Successfully upgraded **${character.name}**!`)
            .addFields(
                {
                    name: '📊 Level Progress',
                    value: `**${currentLevel}** → **${newLevel}**`,
                    inline: true
                },
                {
                    name: '💎 Shards Spent',
                    value: totalCost.toLocaleString(),
                    inline: true
                },
                {
                    name: '📈 Stat Improvements',
                    value: [
                        `⚔️ Attack: ${oldStats.attack} → ${newStats.attack} (+${newStats.attack - oldStats.attack})`,
                        `🛡️ Defense: ${oldStats.defense} → ${newStats.defense} (+${newStats.defense - oldStats.defense})`,
                        `💨 Speed: ${oldStats.speed} → ${newStats.speed} (+${newStats.speed - oldStats.speed})`,
                        `❤️ Health: ${oldStats.health} → ${newStats.health} (+${oldStats.health - newStats.health})`
                    ].join('\n'),
                    inline: false
                }
            )
            .setFooter({
                text: `Remaining shards: ${(user.shards - totalCost).toLocaleString()}`
            })
            .setTimestamp();

        // Add upgrade again button if more upgrades are possible
        const components = [];
        if (newLevel < maxLevel) {
            const nextCost = shardService.getUpgradeCost(character.rarity, newLevel);
            const canAfford = (user.shards - totalCost) >= nextCost;

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`upgrade_${character.id}_${newLevel}`)
                        .setLabel(`Upgrade to Level ${newLevel + 1}`)
                        .setStyle(canAfford ? ButtonStyle.Primary : ButtonStyle.Secondary)
                        .setDisabled(!canAfford)
                        .setEmoji('⬆️')
                );

            if (!canAfford) {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId('get_shards')
                        .setLabel(`Need ${nextCost} Shards`)
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.com/channels/@me') // Placeholder
                );
            }

            components.push(row);
        } else {
            // Reached level cap
            const group = rarityUpgradeService.getRarityGroup(character.rarity);
            embed.addFields({
                name: '🏆 Level Cap Reached!',
                value: `**${character.name}** has reached the maximum level (${maxLevel}) for the ${group} group!\n\nThis character is now at peak performance.`,
                inline: false
            });
        }

        await interaction.editReply({ embeds: [embed], components });
    }
};
