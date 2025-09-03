const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const ShardService = require('../../services/ShardService');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quest')
        .setDescription('Complete quests to earn shards and rewards')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Quest type')
                .setRequired(false)
                .addChoices(
                    { name: 'Main Story Quest', value: 'main_story' },
                    { name: 'Daily Quest', value: 'daily' },
                    { name: 'Side Quest', value: 'side_quest' },
                    { name: 'Achievement Quest', value: 'achievement' }
                )),

    async execute(interaction) {
        const questType = interaction.options.getString('type') || 'main_story';
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

            // Define quests based on type
            const quests = {
                main_story: {
                    title: 'Main Story Quest',
                    description: 'Continue the epic journey through the dimensional realms',
                    baseReward: 100,
                    energyCost: 50,
                    duration: '2-3 minutes',
                    objectives: [
                        'Defeat 3 enemy waves',
                        'Collect dimensional crystals',
                        'Complete the story segment'
                    ]
                },
                daily: {
                    title: 'Daily Quest',
                    description: 'Complete daily challenges to earn consistent rewards',
                    baseReward: 25,
                    energyCost: 20,
                    duration: '1-2 minutes',
                    objectives: [
                        'Login to the game',
                        'Complete 5 battles',
                        'Use 3 different characters'
                    ]
                },
                side_quest: {
                    title: 'Side Quest',
                    description: 'Explore optional content and side stories',
                    baseReward: 50,
                    energyCost: 30,
                    duration: '3-5 minutes',
                    objectives: [
                        'Explore hidden areas',
                        'Help NPCs with tasks',
                        'Find rare items'
                    ]
                },
                achievement: {
                    title: 'Achievement Quest',
                    description: 'Complete special milestone achievements',
                    baseReward: 75,
                    energyCost: 25,
                    duration: 'Varies',
                    objectives: [
                        'Reach level 10',
                        'Collect 10 unique characters',
                        'Win 50 battles'
                    ]
                }
            };

            const quest = quests[questType];

            // Check if user has enough energy
            if (user.dimensionalEnergy < quest.energyCost) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Insufficient Energy`)
                    .setDescription(`You need **${quest.energyCost}** energy to start this quest.\nYou have **${user.dimensionalEnergy}** energy.`)
                    .addFields({
                        name: '⏰ Energy Regeneration',
                        value: 'Energy regenerates automatically over time.\nYou can also wait or use energy potions.'
                    });
                return await interaction.editReply({ embeds: [embed] });
            }

            // Create quest start embed
            const startEmbed = new EmbedBuilder()
                .setColor(COLORS.INFO)
                .setTitle(`📜 ${quest.title}`)
                .setDescription(quest.description)
                .addFields(
                    {
                        name: '🎯 Objectives',
                        value: quest.objectives.map(obj => `• ${obj}`).join('\n'),
                        inline: false
                    },
                    {
                        name: '💎 Rewards',
                        value: [
                            `**Shards:** ${quest.baseReward}`,
                            `**Energy Cost:** ${quest.energyCost}`,
                            `**Duration:** ${quest.duration}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '⚡ Your Energy',
                        value: `${user.dimensionalEnergy}/${user.maxEnergy}`,
                        inline: true
                    }
                )
                .setFooter({
                    text: 'Click "Start Quest" to begin your adventure!',
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            // Add start quest button
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`start_quest_${questType}_${Date.now()}`)
                        .setLabel('Start Quest')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('🎮'),
                    new ButtonBuilder()
                        .setCustomId('cancel_quest')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('❌')
                );

            await interaction.editReply({ embeds: [startEmbed], components: [row] });

        } catch (error) {
            console.error('Quest command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Quest Error`)
                .setDescription('An error occurred while loading quests.');

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
