const { SlashCommandBuilder, EmbedBuilder, MessageFlags, AttachmentBuilder } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const GachaService = require('../../services/GachaService');
const PullImageGenerator = require('../../services/PullImageGenerator');
const { COLORS, EMOJIS } = require('../../config/constants');
const CharacterCardRenderer = require('../../services/CharacterCardRenderer'); // Import the new renderer

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

            if (!models) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                    .setDescription('The database is not configured.');
                return await interaction.editReply({ embeds: [embed] });
            }

            const userService = new UserService();
            const user = await userService.getOrCreateUser(userId, interaction.user.username);

            if (user.coins < totalCost) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Insufficient Coins`)
                    .setDescription(`You need **${totalCost.toLocaleString()}** coins for ${amount} pull${amount > 1 ? 's' : ''}.\nYou have **${user.coins.toLocaleString()}** coins.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            const characters = await models.Character.findAll({
                where: {
                    rarity: {
                        [models.Sequelize.Op.ne]: 'DIMENSIONAL'
                    }
                }
            });

            if (characters.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} No Characters Available`)
                    .setDescription('No characters are available for pulling.');
                return await interaction.editReply({ embeds: [embed] });
            }

            const gachaService = new GachaService();
            const pullResult = await gachaService.performPull(userId, interaction.user.username, amount, totalCost);
            const pulledCharacters = pullResult.results;

            const imageGenerator = new PullImageGenerator();
            let resultImage = null;

            try {
                // Generate framed URLs for the image generator
                const pulledCharacterData = await Promise.all(pulledCharacters.map(async pull => {
                    const characterData = pull.character.toJSON();
                    // Replace the base image with the new framed URL from the renderer
                    const cardRenderer = new CharacterCardRenderer();
                    characterData.image = await cardRenderer.renderCardUrl(characterData);
                    return characterData;
                }));
                
                const imageBuffer = await imageGenerator.generatePullResultsImage(pulledCharacterData);
                resultImage = new AttachmentBuilder(imageBuffer, { name: 'pull-results.png' });
            } catch (error) {
                console.warn('Failed to generate pull result image:', error);
            }

            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.GACHA} Pull Results`)
                .setDescription(`You spent **${totalCost.toLocaleString()}** coins and got:`);

            pulledCharacters.forEach((pull) => {
                const rarityEmoji = {
                    'COMMON': '⚪', 'RARE': '🟢', 'EPIC': '🟣', 'LEGENDARY': '🟡', 'MYTHIC': '🔴', 'DIMENSIONAL': '🌌'
                }[pull.character.rarity] || '⚪';
                const newIndicator = pull.isNew ? ' 🆕' : '';
                const duplicateIndicator = pull.isDuplicate ? ' 🔄' : '';
                let value = `**Anime:** ${pull.character.anime}\n**Rarity:** ${pull.character.rarity}`;

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

            const updatedUser = await userService.getUserById(userId);
            embed.setFooter({ text: `Remaining coins: ${updatedUser.coins.toLocaleString()} | Pity Counter: ${updatedUser.pityCounter || 0}/100 | Use /collection to view your characters` });

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

