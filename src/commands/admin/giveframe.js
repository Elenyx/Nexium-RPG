const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { models } = require('../../database/connection');
const { COLORS, EMOJIS, VALID_FRAME_IDS, FRAMES } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveframe')
        .setDescription('[ADMIN] Give a special frame to a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to give frame to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frame_id')
                .setDescription('Special frame ID to give')
                .setRequired(true)
                .addChoices(
                    // Rarity frames
                    { name: 'Common Frame', value: 'common' },
                    { name: 'Rare Frame', value: 'rare' },
                    { name: 'Epic Frame', value: 'epic' },
                    { name: 'Legendary Frame', value: 'legendary' },
                    { name: 'Mythic Frame', value: 'mythic' },
                    { name: 'Dimensional Frame', value: 'dimensional' },
                    // Special frames
                    { name: '🎉 Golden Anniversary Frame', value: 'golden_anniversary' },
                    { name: '🎄 Christmas Festive Frame', value: 'christmas_festive' },
                    { name: '👻 Halloween Spooky Frame', value: 'halloween_spooky' },
                    { name: '💝 Valentine\'s Romantic Frame', value: 'valentines_romantic' },
                    { name: '🏖️ Summer Vacation Frame', value: 'summer_vacation' },
                    { name: '🎊 New Year Celebration Frame', value: 'new_year_celebration' },
                    { name: '🏆 Community Champion Frame', value: 'community_champion' },
                    { name: '🧪 Beta Tester Frame', value: 'beta_tester' },
                    { name: '⭐ Early Supporter Frame', value: 'early_supporter' }
                )),

    async execute(interaction) {
        // Check if user has administrator permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle(`${EMOJIS.ERROR} Permission Denied`)
                .setDescription('You need Administrator permissions to use this command.')
                .setColor(COLORS.ERROR);
            return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        const targetUser = interaction.options.getUser('user');
        const frameId = interaction.options.getString('frame_id');

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

            // Get frame details
            const selectedFrame = FRAMES[frameId.toUpperCase()] || FRAMES[Object.keys(FRAMES).find(key => FRAMES[key].id === frameId)];
            if (!selectedFrame) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Invalid Frame`)
                    .setDescription(`Frame \`${frameId}\` does not exist.`);

                return await interaction.editReply({ embeds: [embed] });
            }

            // Find or create user profile to store unlocked frames
            let userProfile = await models.UserProfile.findOne({
                where: { userId: targetUser.id }
            });

            if (!userProfile) {
                // Create user profile if it doesn't exist
                userProfile = await models.UserProfile.create({
                    userId: targetUser.id,
                    unlockedFrames: [frameId],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            } else {
                // Add frame to unlocked frames if not already unlocked
                const unlockedFrames = userProfile.unlockedFrames || [];
                if (!unlockedFrames.includes(frameId)) {
                    unlockedFrames.push(frameId);
                    await userProfile.update({ 
                        unlockedFrames,
                        updatedAt: new Date()
                    });
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(COLORS.WARNING)
                        .setTitle(`${EMOJIS.WARNING} Frame Already Unlocked`)
                        .setDescription(`${targetUser.username} already has the **${selectedFrame.name}** unlocked.`);

                    return await interaction.editReply({ embeds: [embed] });
                }
            }

            // Log successful frame unlock
            console.log(`[ADMIN] ${interaction.user.username} unlocked frame '${frameId}' for ${targetUser.username}`);

            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.SUCCESS} Special Frame Unlocked!`)
                .setDescription(`Successfully unlocked **${selectedFrame.name}** for ${targetUser.username}!`)
                .addFields(
                    { name: 'User', value: targetUser.username, inline: true },
                    { name: 'Frame Unlocked', value: `${selectedFrame.name} (${frameId})`, inline: true },
                    { name: 'Obtainable', value: selectedFrame.obtainable, inline: true },
                    { name: 'Frame Description', value: selectedFrame.description, inline: false }
                )
                .setFooter({ text: 'User can now apply this frame to any character they own using /skin' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Give frame command error:', error);

            const embed = new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setTitle(`${EMOJIS.ERROR} Error`)
                .setDescription('An error occurred while unlocking the frame.');

            await interaction.editReply({ embeds: [embed] });
        }
    }
};
