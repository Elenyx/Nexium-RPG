const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = new (require('../../services/UserService'))();
const BattleService = new (require('../../services/BattleService'))();
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('battle')
        .setDescription('Battle between your characters')
        .addStringOption(option =>
            option.setName('character1')
                .setDescription('First character ID')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('character2')
                .setDescription('Second character ID')
                .setRequired(true)),

    async execute(interaction) {
        const char1Id = interaction.options.getString('character1');
        const char2Id = interaction.options.getString('character2');
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

            // Validate that characters are different
            if (char1Id === char2Id) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Invalid Battle`)
                    .setDescription('You cannot battle a character against itself!');
                return await interaction.editReply({ embeds: [embed] });
            }

            // Start battle
            const battleResult = await BattleService.startBattle(userId, char1Id, char2Id);

            // Create battle result embed
            const embed = new EmbedBuilder()
                .setColor(battleResult.battle.isDraw ? COLORS.WARNING : COLORS.SUCCESS)
                .setTitle(`${EMOJIS.BATTLE} Battle Results`)
                .setDescription(
                    battleResult.battle.isDraw
                        ? '🤝 The battle ended in a draw!'
                        : `🏆 **${battleResult.battle.winner.name}** wins the battle!`
                )
                .addFields(
                    {
                        name: '⚔️ Participants',
                        value: [
                            `**${battleResult.participants.char1.name}** (Lv.${battleResult.participants.char1.customLevel})`,
                            `**${battleResult.participants.char2.name}** (Lv.${battleResult.participants.char2.customLevel})`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '📊 Battle Stats',
                        value: [
                            `**Turns:** ${battleResult.battle.totalTurns}`,
                            `**Final HP:**`,
                            `${battleResult.participants.char1.name}: ${battleResult.battle.finalHp[battleResult.participants.char1.name]}`,
                            `${battleResult.participants.char2.name}: ${battleResult.battle.finalHp[battleResult.participants.char2.name]}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🎁 Rewards',
                        value: [
                            `**EXP:** +${battleResult.rewards.exp}`,
                            `**Coins:** +${battleResult.rewards.coins}`
                        ].join('\n'),
                        inline: true
                    }
                )
                .setFooter({
                    text: 'Use /battle again to try different matchups!',
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            // Add battle summary for longer battles
            if (battleResult.battle.turns.length > 10) {
                const summaryTurns = battleResult.battle.turns.slice(-6); // Show last 6 turns
                const turnSummary = summaryTurns.map(turn =>
                    `**Turn ${turn.turn}:** ${turn.attacker} → ${turn.defender} (-${turn.damage} HP)`
                ).join('\n');

                embed.addFields({
                    name: '📝 Battle Summary (Last 6 turns)',
                    value: turnSummary,
                    inline: false
                });
            }

            // Add rematch button
            const components = [];
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('collection_view_battle')
                        .setLabel('View Collection')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📚')
                );

            components.push(row);

            await interaction.editReply({ embeds: [embed], components });

        } catch (error) {
            console.error('Battle command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Battle Error`)
                .setDescription(error.message || 'An error occurred while starting the battle.');

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
