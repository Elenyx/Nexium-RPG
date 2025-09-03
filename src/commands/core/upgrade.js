const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const ShardService = require('../../services/ShardService');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upgrade')
        .setDescription('Upgrade your characters using shards')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to upgrade')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('levels')
                .setDescription('Number of levels to upgrade (1-10)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction) {
        const characterId = interaction.options.getString('character_id');
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

            // Calculate upgrade cost
            const totalCost = shardService.getTotalUpgradeCost(character.rarity, currentLevel, currentLevel + levels);

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
    }
};
