/**
 * UpgradeButtonHandlers.js - Handles button interactions for character upgrades
 */

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const ShardService = require('../../services/ShardService');
const RarityUpgradeService = require('../../services/RarityUpgradeService');
const { COLORS, EMOJIS } = require('../../config/constants');

class UpgradeButtonHandlers {
    constructor(client) {
        this.client = client;
    }

    /**
     * Check if this handler can handle the given customId
     * @param {string} customId - The button custom ID
     * @returns {boolean} Whether this handler can handle it
     */
    canHandle(customId) {
        return customId.startsWith('upgrade_') || customId === 'get_shards';
    }

    /**
     * Handle upgrade button interactions
     * @param {ButtonInteraction} interaction - The button interaction
     */
    async handle(interaction) {
        const customId = interaction.customId;

        try {
            await interaction.deferUpdate();

            if (customId === 'get_shards') {
                return await this.handleGetShards(interaction);
            }

            // Handle upgrade buttons (format: upgrade_characterId_currentLevel)
            const parts = customId.split('_');
            if (parts.length >= 3 && parts[0] === 'upgrade') {
                const characterId = parts[1];
                const targetLevel = parseInt(parts[2]);

                return await this.handleLevelUpgrade(interaction, characterId, targetLevel);
            }

            // Unknown upgrade button
            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Unknown Upgrade Action`)
                .setDescription('This upgrade button is no longer valid.');

            await interaction.editReply({ embeds: [embed], components: [] });

        } catch (error) {
            console.error('Upgrade button handler error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Button Error`)
                .setDescription('An error occurred while processing this button.');

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [embed], components: [] });
            } else {
                await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }
        }
    }

    /**
     * Handle level upgrade button
     * @param {ButtonInteraction} interaction - The button interaction
     * @param {string} characterId - Character ID to upgrade
     * @param {number} targetLevel - Target level to upgrade to
     */
    async handleLevelUpgrade(interaction, characterId, targetLevel) {
        const userId = interaction.user.id;

        // Check if database is available
        if (!models) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                .setDescription('The database is not configured.');
            return await interaction.editReply({ embeds: [embed], components: [] });
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
                .setDescription(`You no longer own this character.`);
            return await interaction.editReply({ embeds: [embed], components: [] });
        }

        const character = userCharacter.character;
        const currentLevel = userCharacter.customLevel;

        // Validate target level
        if (targetLevel <= currentLevel) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.WARNING)
                .setTitle(`${EMOJIS.WARNING} Already Upgraded`)
                .setDescription(`${character.name} is already at level ${currentLevel} or higher.`);
            return await interaction.editReply({ embeds: [embed], components: [] });
        }

        // Get level cap for this character
        const maxLevel = rarityUpgradeService.getLevelCapForRarity(character.rarity);
        if (targetLevel > maxLevel) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.WARNING)
                .setTitle(`${EMOJIS.WARNING} Level Cap Reached`)
                .setDescription(`${character.name} cannot be upgraded beyond level ${maxLevel}.`);
            return await interaction.editReply({ embeds: [embed], components: [] });
        }

        // Calculate upgrade cost
        const levelsToUpgrade = targetLevel - currentLevel;
        const totalCost = shardService.getTotalUpgradeCost(character.rarity, currentLevel, targetLevel);

        // Check if user has enough shards
        if (user.shards < totalCost) {
            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Insufficient Shards`)
                .setDescription(`You need **${totalCost.toLocaleString()}** ${EMOJIS.SHARD} shards to upgrade ${levelsToUpgrade} level${levelsToUpgrade > 1 ? 's' : ''}.\nYou have **${user.shards.toLocaleString()}** shards.`);
            return await interaction.editReply({ embeds: [embed], components: [] });
        }

        // Perform upgrade
        const newLevel = targetLevel;
        await models.UserCharacter.update(
            { customLevel: newLevel },
            { where: { userId, characterId } }
        );

        // Deduct shards
        await shardService.removeShards(userId, totalCost, `Character level upgrade: ${character.name} to level ${newLevel}`);

        // Add some shards to rarity upgrade progress (10% of upgrade cost)
        const shardsForRarity = Math.floor(totalCost * 0.1);
        if (shardsForRarity > 0) {
            await rarityUpgradeService.addShardsToRarityUpgrade(userId, characterId, shardsForRarity);
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
                        `🛡️ Defense: ${oldStats.defense} → ${newStats.defense} (+${oldStats.defense - newStats.defense})`,
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
        } else {
            // Reached level cap
            embed.addFields({
                name: '🏆 Level Cap Reached!',
                value: `**${character.name}** has reached the maximum level (${maxLevel}) for its rarity group!\n\nThis character is now at peak performance.`,
                inline: false
            });
        }

        await interaction.editReply({ embeds: [embed], components });
    }

    /**
     * Handle get shards button
     * @param {ButtonInteraction} interaction - The button interaction
     */
    async handleGetShards(interaction) {
        const embed = new EmbedBuilder()
            .setColor(COLORS.INFO)
            .setTitle(`${EMOJIS.SHARD} How to Get More Shards`)
            .setDescription('Here are ways to earn shards for character upgrades:')
            .addFields(
                {
                    name: '🎯 Complete Quests',
                    value: '• Daily quests: 25-75 shards\n• Main story quests: 100-200 shards\n• Side quests: 50-100 shards',
                    inline: false
                },
                {
                    name: '⚔️ Battle & Win',
                    value: '• PvE battles: 10-50 shards per win\n• Tournament participation: 100+ shards\n• Special events: Bonus multipliers',
                    inline: false
                },
                {
                    name: '🏰 Territory Control',
                    value: '• Claim territories: 50-200 shards\n• Territory defense: Daily income\n• Alliance bonuses: Extra rewards',
                    inline: false
                },
                {
                    name: '🎮 Mini-Games & Events',
                    value: '• Puzzle games: 25-100 shards\n• Trivia battles: 50-150 shards\n• Seasonal events: 200+ shards',
                    inline: false
                }
            )
            .setFooter({ text: 'Keep playing to earn more shards!' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], components: [] });
    }
}

module.exports = UpgradeButtonHandlers;
