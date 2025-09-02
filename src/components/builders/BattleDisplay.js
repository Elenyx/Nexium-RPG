/**
 * @file Battle Component Builder
 * @description Creates interactive battle displays using Discord Components V2
 * @author Nexium Bot Development Team
 */

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require('discord.js');
const { COLORS, EMOJIS } = require('../../config/constants');

class BattleDisplay {
    /**
     * Creates the main battle interface
     * @param {Object} battle - Battle data
     * @param {Object} player - Player character data
     * @param {Object} opponent - Opponent character data
     * @returns {Object} Message options with battle interface
     */
    static createBattleInterface(battle, player, opponent) {
        const embed = new EmbedBuilder()
            .setTitle(`${EMOJIS.BATTLE} Dimensional Battle`)
            .setDescription(`**${battle.playerName}** vs **${battle.opponentName}**`)
            .setColor(battle.turn === 'player' ? COLORS.SUCCESS : COLORS.WARNING)
            .addFields(
                {
                    name: `🦸 ${battle.playerName}`,
                    value: [
                        `**Health:** ${player.currentHealth}/${player.maxHealth} ❤️`,
                        `**Energy:** ${player.currentEnergy}/${player.maxEnergy} ⚡`,
                        `**Status:** ${this.formatStatusEffects(player.statusEffects)}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: `👹 ${battle.opponentName}`,
                    value: [
                        `**Health:** ${opponent.currentHealth}/${opponent.maxHealth} ❤️`,
                        `**Energy:** ${opponent.currentEnergy}/${opponent.maxEnergy} ⚡`,
                        `**Status:** ${this.formatStatusEffects(opponent.statusEffects)}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '🎯 Battle Info',
                    value: [
                        `**Turn:** ${battle.turn === 'player' ? battle.playerName : battle.opponentName}`,
                        `**Round:** ${battle.round}`,
                        `**Battle Type:** ${battle.type}`,
                        battle.description ? `**Status:** ${battle.description}` : ''
                    ].filter(Boolean).join('\n'),
                    inline: false
                }
            )
            .setFooter({ text: battle.turn === 'player' ? 'Choose your action!' : 'Waiting for opponent...' })
            .setTimestamp();

        const components = [];

        if (battle.turn === 'player' && battle.status === 'active') {
            const actionRow1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`battle_attack_${battle.id}`)
                        .setLabel('Attack')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('⚔️'),
                    new ButtonBuilder()
                        .setCustomId(`battle_defend_${battle.id}`)
                        .setLabel('Defend')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('🛡️'),
                    new ButtonBuilder()
                        .setCustomId(`battle_special_${battle.id}`)
                        .setLabel('Special')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('✨')
                        .setDisabled(player.currentEnergy < 20)
                );

            const actionRow2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`battle_item_${battle.id}`)
                        .setLabel('Use Item')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🎒'),
                    new ButtonBuilder()
                        .setCustomId(`battle_flee_${battle.id}`)
                        .setLabel('Flee')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🏃')
                );

            components.push(actionRow1, actionRow2);
        } else if (battle.status === 'finished') {
            const resultRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`battle_rematch_${battle.id}`)
                        .setLabel('Rematch')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('🔄'),
                    new ButtonBuilder()
                        .setCustomId(`battle_profile_${battle.playerId}`)
                        .setLabel('View Profile')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('👤'),
                    new ButtonBuilder()
                        .setCustomId(`battle_leaderboard_${battle.playerId}`)
                        .setLabel('Leaderboard')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🏆')
                );

            components.push(resultRow);
        }

        return {
            embeds: [embed],
            components: components,
            flags: MessageFlags.IsComponentsV2
        };
    }

    /**
     * Creates a battle result summary
     * @param {Object} battle - Completed battle data
     * @param {Object} player - Player data
     * @param {Object} opponent - Opponent data
     * @returns {Object} Message options with battle results
     */
    static createBattleResult(battle, player, opponent) {
        const winner = battle.winner === 'player' ? player : opponent;
        const loser = battle.winner === 'player' ? opponent : player;

        const embed = new EmbedBuilder()
            .setTitle(`${EMOJIS.BATTLE} Battle Complete!`)
            .setDescription(`🏆 **${winner.name}** has defeated **${loser.name}**!`)
            .setColor(battle.winner === 'player' ? COLORS.SUCCESS : COLORS.ERROR)
            .addFields(
                {
                    name: '📊 Battle Summary',
                    value: [
                        `**Winner:** ${winner.name}`,
                        `**Rounds:** ${battle.round}`,
                        `**Battle Type:** ${battle.type}`,
                        `**Duration:** ${battle.duration || 'Unknown'}`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: '🎁 Rewards',
                    value: battle.rewards && battle.rewards.length > 0
                        ? battle.rewards.map(reward => `• ${reward}`).join('\n')
                        : 'No rewards earned',
                    inline: true
                },
                {
                    name: '📈 Experience Gained',
                    value: battle.winner === 'player'
                        ? `**+${battle.expGained || 0}** XP`
                        : '**+0** XP (Defeat)',
                    inline: true
                }
            )
            .setFooter({ text: 'Great battle! Keep improving your skills!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`battle_rematch_${battle.id}`)
                    .setLabel('Rematch')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🔄'),
                new ButtonBuilder()
                    .setCustomId(`battle_new_opponent_${player.id}`)
                    .setLabel('Find New Opponent')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new ButtonBuilder()
                    .setCustomId(`battle_profile_${player.id}`)
                    .setLabel('View Profile')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('👤')
            );

        return {
            embeds: [embed],
            components: [row],
            flags: MessageFlags.IsComponentsV2
        };
    }

    /**
     * Creates an action selection interface
     * @param {Object} character - Character data with abilities
     * @param {string} battleId - Battle ID
     * @returns {Object} Message options with action selection
     */
    static createActionSelection(character, battleId) {
        const embed = new EmbedBuilder()
            .setTitle('🎯 Choose Your Action')
            .setDescription('Select an ability to use in battle:')
            .setColor(COLORS.INFO)
            .setFooter({ text: 'Each ability has different energy costs and effects' });

        if (character.abilities && character.abilities.length > 0) {
            character.abilities.forEach((ability, index) => {
                embed.addFields({
                    name: `${ability.emoji || '⚡'} ${ability.name}`,
                    value: [
                        ability.description,
                        `**Damage:** ${ability.damage || 0}`,
                        `**Energy Cost:** ${ability.energyCost || 0}`,
                        `**Cooldown:** ${ability.cooldown || 0} turns`
                    ].join('\n'),
                    inline: true
                });
            });
        } else {
            embed.addFields({
                name: '⚡ Basic Attack',
                value: 'A standard attack\n**Damage:** 10-20\n**Energy Cost:** 5\n**Cooldown:** None',
                inline: false
            });
        }

        const components = [];

        if (character.abilities && character.abilities.length > 0) {
            const abilityRow = new ActionRowBuilder();

            character.abilities.forEach((ability, index) => {
                if (index < 4) { // Max 4 abilities per row
                    abilityRow.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`battle_ability_${battleId}_${index}`)
                            .setLabel(ability.name)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(ability.emoji || '⚡')
                            .setDisabled(character.currentEnergy < (ability.energyCost || 0))
                    );
                }
            });

            components.push(abilityRow);
        }

        const controlRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`battle_back_${battleId}`)
                    .setLabel('Back to Battle')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        components.push(controlRow);

        return {
            embeds: [embed],
            components: components,
            flags: MessageFlags.IsComponentsV2
        };
    }

    /**
     * Creates an item selection interface for battle
     * @param {Array} items - Available battle items
     * @param {string} battleId - Battle ID
     * @returns {Object} Message options with item selection
     */
    static createItemSelection(items, battleId) {
        const embed = new EmbedBuilder()
            .setTitle('🎒 Select Battle Item')
            .setDescription('Choose an item to use in battle:')
            .setColor(COLORS.INFO);

        if (items.length === 0) {
            embed.addFields({
                name: '📭 No Items Available',
                value: 'You don\'t have any battle items!\nVisit the shop to purchase some.',
                inline: false
            });
        } else {
            items.forEach(item => {
                embed.addFields({
                    name: `${item.emoji} ${item.name} (x${item.quantity})`,
                    value: [
                        item.description,
                        `**Effect:** ${item.effect}`,
                        `**Type:** ${item.type}`
                    ].join('\n'),
                    inline: true
                });
            });
        }

        const components = [];

        if (items.length > 0) {
            const itemRow = new ActionRowBuilder();

            items.slice(0, 4).forEach((item, index) => {
                itemRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`battle_use_item_${battleId}_${item.id}`)
                        .setLabel(`${item.name} (${item.quantity})`)
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(item.emoji)
                        .setDisabled(item.quantity <= 0)
                );
            });

            components.push(itemRow);
        }

        const backRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`battle_back_${battleId}`)
                    .setLabel('Back to Battle')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        components.push(backRow);

        return {
            embeds: [embed],
            components: components,
            flags: MessageFlags.IsComponentsV2
        };
    }

    /**
     * Formats status effects for display
     * @param {Array} statusEffects - Array of status effects
     * @returns {string} Formatted status effects
     */
    static formatStatusEffects(statusEffects) {
        if (!statusEffects || statusEffects.length === 0) {
            return 'Normal';
        }

        return statusEffects.map(effect => {
            const emoji = this.getStatusEmoji(effect.type);
            return `${emoji} ${effect.name} (${effect.duration})`;
        }).join(', ');
    }

    /**
     * Gets emoji for status effect type
     * @param {string} type - Status effect type
     * @returns {string} Status emoji
     */
    static getStatusEmoji(type) {
        const emojis = {
            'burn': '🔥',
            'poison': '☠️',
            'freeze': '❄️',
            'stun': '💫',
            'buff': '⬆️',
            'debuff': '⬇️',
            'heal': '❤️',
            'shield': '🛡️'
        };
        return emojis[type] || '❓';
    }
}

module.exports = BattleDisplay;
