const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const PullImageGenerator = require('../../services/PullImageGenerator');
const CardLevelingService = require('../../services/CardLevelingService');
const { COLORS, EMOJIS, RARITY_GROUPS, RARITY_UPGRADE_THRESHOLDS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('View a specific character card by ID')
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('ID of the character to view')
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

            // Find the character in the database
            const character = await models.Character.findByPk(characterId);

            if (!character) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Found`)
                    .setDescription(`No character found with ID \`${characterId}\`.\nUse \`/collection\` to see available characters and their IDs.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Check if user owns this character
            const userCharacter = await models.UserCharacter.findOne({
                where: { userId, characterId },
                include: [{
                    model: models.Character,
                    as: 'character'
                }]
            });

            const ownsCharacter = !!userCharacter;

            // Generate the character card image (450x600)
            const pullImageGenerator = new PullImageGenerator();
            const cardBuffer = await pullImageGenerator.generateCharacterCard(character, 450, 600);

            // Get rarity color and emoji
            const rarityColors = {
                'COMMON': '#9CA3AF',
                'RARE': '#3B82F6',
                'EPIC': '#8B5CF6',
                'LEGENDARY': '#F59E0B',
                'MYTHIC': '#EF4444',
                'DIMENSIONAL': '#7C3AED'
            };

            const rarityEmojis = {
                'COMMON': '⚪',
                'RARE': '🟢',
                'EPIC': '🟣',
                'LEGENDARY': '🟡',
                'MYTHIC': '🔴',
                'DIMENSIONAL': '🌌'
            };

            // Create embed with character information
            const embed = new EmbedBuilder()
                .setColor(rarityColors[character.rarity] || COLORS.PRIMARY)
                .setTitle(`${rarityEmojis[character.rarity] || '🎴'} ${character.name}`)
                .setImage('attachment://character-card.png')
                .setTimestamp();

            let description = `**ID:** \`${character.id}\`\n**Anime:** ${character.anime}\n**Rarity:** ${character.rarity}`;

            // Add ownership status
            if (ownsCharacter) {
                description += `\n\n${EMOJIS.SUCCESS} **Owned**`;
                if (userCharacter.isFavorite) {
                    description += ` | ${EMOJIS.SHARD} **Favorited**`;
                }
            } else {
                description += `\n\n${EMOJIS.ERROR} **Not Owned**`;
            }

            // Add base stats
            description += `\n\n**Base Stats:**\n`;
            description += `${EMOJIS.BATTLE} Attack: ${character.attack}\n`;
            description += `🛡️ Defense: ${character.defense}\n`;
            description += `💨 Speed: ${character.speed}\n`;
            description += `❤️ Health: ${character.health}`;

            // Add leveled stats and progress if owned
            if (ownsCharacter) {
                const cardLevelingService = new CardLevelingService();
                const levelingProgress = await cardLevelingService.getLevelingProgress(userId, characterId);

                const currentLevel = levelingProgress.currentLevel;
                const scaledStats = levelingProgress.scaledStats;

                description += `\n\n**Current Level:** ${currentLevel}/100`;
                description += `\n**EXP:** ${levelingProgress.currentExp.toLocaleString()}`;

                if (!levelingProgress.isMaxLevel) {
                    const expNeeded = levelingProgress.expNeeded;
                    const expProgress = levelingProgress.expProgress;
                    const progressPercentage = levelingProgress.progressPercentage;

                    description += `\n**Next Level:** ${expNeeded - expProgress} EXP needed`;
                    description += `\n**Progress:** ${'❚'.repeat(Math.floor(progressPercentage / 10))} ${progressPercentage.toFixed(1)}%`;
                } else {
                    description += `\n**Progress:** ${EMOJIS.SUCCESS} Max Level Reached!`;
                }

                // Add scaled stats
                description += `\n\n**Scaled Stats (Lv.${currentLevel}):**\n`;
                description += `${EMOJIS.BATTLE} Attack: ${scaledStats.attack} (+${scaledStats.attack - character.attack})\n`;
                description += `🛡️ Defense: ${scaledStats.defense} (+${scaledStats.defense - character.defense})\n`;
                description += `💨 Speed: ${scaledStats.speed} (+${scaledStats.speed - character.speed})\n`;
                description += `❤️ Health: ${scaledStats.health} (+${scaledStats.health - character.health})`;

                // Add rarity progression info
                const currentRarityIndex = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIMENSIONAL'].indexOf(character.rarity);
                const nextRarity = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'DIMENSIONAL'][currentRarityIndex + 1];

                if (nextRarity && character.rarity !== 'DIMENSIONAL') {
                    const collectedShards = userCharacter.collectedShards || 0;
                    const threshold = RARITY_UPGRADE_THRESHOLDS[character.rarity] || 0;

                    if (threshold > 0) {
                        description += `\n\n**Rarity Upgrade:** ${character.rarity} → ${nextRarity}`;
                        description += `\n**Shards:** ${collectedShards}/${threshold} ${EMOJIS.SHARD}`;
                        description += `\n**Progress:** ${'❚'.repeat(Math.floor((collectedShards / threshold) * 10))} ${(collectedShards / threshold * 100).toFixed(1)}%`;
                    }
                }

                // Add obtained date
                if (userCharacter.obtainedAt) {
                    const obtainedDate = new Date(userCharacter.obtainedAt).toLocaleDateString();
                    description += `\n\n**Obtained:** ${obtainedDate}`;
                }
            }

            // Add character description if available
            if (character.description) {
                description += `\n\n**Description:**\n${character.description}`;
            }

            embed.setDescription(description);

            // Set footer based on ownership
            if (ownsCharacter) {
                embed.setFooter({ text: 'Use /upgrade to level up this character • Use /collection to view all owned characters' });
            } else {
                embed.setFooter({ text: 'Use /pull to try to obtain this character • Use /collection to view all owned characters' });
            }

            await interaction.editReply({
                embeds: [embed],
                files: [{
                    attachment: cardBuffer,
                    name: 'character-card.png'
                }]
            });

        } catch (error) {
            console.error('Card command error:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Card Error`)
                .setDescription('An error occurred while generating the character card.')
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
