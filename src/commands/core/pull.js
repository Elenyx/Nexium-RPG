const { SlashCommandBuilder, EmbedBuilder, MessageFlags, AttachmentBuilder } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const GachaService = require('../../services/GachaService');
const PullImageGenerator = require('../../services/PullImageGenerator');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull')
        .setDescription('Pull for a random character (costs 100 coins)')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of pulls (1-10)')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)),

    async execute(interaction) {
        const userId = interaction.user.id;
        const amount = interaction.options.getInteger('amount') || 1;
        const costPerPull = 100;
        const totalCost = costPerPull * amount;

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

            // Get user data
            const userService = new UserService();
            const user = await userService.getOrCreateUser(userId, interaction.user.username);

            // Check if user has enough coins
            if (user.coins < totalCost) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Insufficient Coins`)
                    .setDescription(`You need **${totalCost.toLocaleString()}** coins for ${amount} pull${amount > 1 ? 's' : ''}.\nYou have **${user.coins.toLocaleString()}** coins.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Get all available characters
            const characters = await models.Character.findAll();
            if (characters.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} No Characters Available`)
                    .setDescription('No characters are available for pulling.');

                return await interaction.editReply({ embeds: [embed] });
            }

            // Perform pulls using GachaService
            const gachaService = new GachaService();
            const pullResult = await gachaService.performPull(userId, interaction.user.username, amount, totalCost);

            // Extract pulled characters from the result
            const pulledCharacters = pullResult.results;

            // Note: Coin deduction is handled by GachaService

            // Generate pull result image
            const imageGenerator = new PullImageGenerator();
            let resultImage = null;

            try {
                const pulledCharacterData = pulledCharacters.map(pull => pull.character);
                const imageBuffer = await imageGenerator.generatePullResultsImage(pulledCharacterData);
                resultImage = new AttachmentBuilder(imageBuffer, { name: 'pull-results.png' });
            } catch (error) {
                console.warn('Failed to generate pull result image:', error);
                // Continue without image if generation fails
            }

            // Create result embed
            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.GACHA} Pull Results`)
                .setDescription(`You spent **${totalCost.toLocaleString()}** coins and got:`);

            // Add character results
            pulledCharacters.forEach((pull, index) => {
                const rarityEmoji = {
                    'COMMON': '⚪',
                    'RARE': '🟢',
                    'EPIC': '🟣',
                    'LEGENDARY': '🟡',
                    'MYTHIC': '🔴',
                    'DIMENSIONAL': '🌌'
                }[pull.character.rarity] || '⚪';

                const newIndicator = pull.isNew ? ' 🆕' : '';
                const duplicateIndicator = pull.isDuplicate ? ' 🔄' : '';

                let value = `**Anime:** ${pull.character.anime}\n**Rarity:** ${pull.character.rarity}`;

                // Add merge information if it's a duplicate
                if (pull.isDuplicate && pull.mergeResult) {
                    const merge = pull.mergeResult;
                    value += `\n**Merged!** +${merge.expGained} EXP`;

                    if (merge.leveledUp) {
                        value += `\n**Leveled up!** ${merge.newLevel - merge.levelsGained} → ${merge.newLevel}`;
                    }

                    if (merge.rarityUpgrade && merge.rarityUpgrade.canUpgrade) {
                        value += `\n**⭐ Rarity upgrade available!**`;
                    }
                }

                embed.addFields({
                    name: `${rarityEmoji} ${pull.character.name}${newIndicator}${duplicateIndicator}`,
                    value: value,
                    inline: amount <= 3
                });
            });

            // Add remaining coins info
            const updatedUser = await userService.getUserById(userId);
            embed.setFooter({
                text: `Remaining coins: ${updatedUser.coins.toLocaleString()} | Pity Counter: ${updatedUser.pityCounter || 0}/100 | Use /collection to view your characters`
            });

            // Send response with or without image
            const responseData = { embeds: [embed] };
            if (resultImage) {
                responseData.files = [resultImage];
                embed.setImage('attachment://pull-results.png');
            }

            await interaction.editReply(responseData);

        } catch (error) {
            console.error('Pull command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Error`)
                .setDescription('An error occurred while performing the pull.');

            await interaction.editReply({ embeds: [embed] });
        }
    }
};
