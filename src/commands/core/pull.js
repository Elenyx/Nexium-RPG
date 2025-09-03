const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
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

            // Perform pulls
            const pulledCharacters = [];
            for (let i = 0; i < amount; i++) {
                const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
                const userCharacter = await userService.addCharacterToUser(userId, randomCharacter.id);
                pulledCharacters.push({
                    character: randomCharacter,
                    isNew: userCharacter.isNewlyCreated
                });
            }

            // Deduct coins
            await userService.updateUser(userId, { coins: user.coins - totalCost });

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
                    'MYTHIC': '🔴'
                }[pull.character.rarity] || '⚪';

                const newIndicator = pull.isNew ? ' 🆕' : '';

                embed.addFields({
                    name: `${rarityEmoji} ${pull.character.name}${newIndicator}`,
                    value: `**Anime:** ${pull.character.anime}\n**Rarity:** ${pull.character.rarity}`,
                    inline: amount <= 3
                });
            });

            // Add remaining coins info
            const updatedUser = await userService.getUserById(userId);
            embed.setFooter({
                text: `Remaining coins: ${updatedUser.coins.toLocaleString()} | Use /collection to view your characters`
            });

            await interaction.editReply({ embeds: [embed] });

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
