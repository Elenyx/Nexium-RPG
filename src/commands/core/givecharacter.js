const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { models } = require('../../database/connection');
const UserService = require('../../services/UserService');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('givecharacter')
        .setDescription('[ADMIN] Give a character to a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to give character to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('character_id')
                .setDescription('Character ID to give')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('favorite')
                .setDescription('Mark as favorite')
                .setRequired(false)),

    async execute(interaction) {
        // Check if user is admin (you can customize this check)
        if (!interaction.user.id === 'YOUR_ADMIN_USER_ID') { // Replace with your Discord user ID
            return await interaction.reply({
                content: 'You do not have permission to use this command.',
                flags: MessageFlags.Ephemeral
            });
        }

        const targetUser = interaction.options.getUser('user');
        const characterId = interaction.options.getString('character_id');
        const isFavorite = interaction.options.getBoolean('favorite') || false;

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

            // Check if character exists
            const character = await models.Character.findByPk(characterId);
            if (!character) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Character Not Found`)
                    .setDescription(`Character with ID \`${characterId}\` does not exist.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Add character to user
            const userService = new UserService();
            const userCharacter = await userService.addCharacterToUser(targetUser.id, characterId, {
                isFavorite: isFavorite
            });

            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Character Added`)
                .setDescription(`Successfully added **${character.name}** to ${targetUser.username}'s collection!`)
                .addFields(
                    { name: 'Character', value: character.name, inline: true },
                    { name: 'Anime', value: character.anime, inline: true },
                    { name: 'Rarity', value: character.rarity, inline: true },
                    { name: 'Favorite', value: isFavorite ? '⭐ Yes' : '❌ No', inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Give character command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Error`)
                .setDescription('An error occurred while adding the character.');

            await interaction.editReply({ embeds: [embed] });
        }
    }
};
