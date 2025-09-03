const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { COLORS, EMOJIS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages from the current channel (Admin only)')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of messages to purge (1-100). Leave empty to purge all available messages.')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(false)
        ),

    async execute(interaction) {
        // Check if user has administrator permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle(`${EMOJIS.ERROR} Permission Denied`)
                .setDescription('You need Administrator permissions to use this command.')
                .setColor(COLORS.ERROR);
            return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        const count = interaction.options.getInteger('count');
        const channel = interaction.channel;

        // Defer reply since this might take time
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            let deletedCount = 0;

            if (count) {
                // Purge specific number of messages
                const messages = await channel.messages.fetch({ limit: count + 1 }); // +1 to account for the command message
                const messagesToDelete = messages.filter(msg => !msg.pinned); // Don't delete pinned messages

                if (messagesToDelete.size > 0) {
                    await channel.bulkDelete(messagesToDelete, true);
                    deletedCount = messagesToDelete.size;
                }
            } else {
                // Purge all messages (up to 1000, in batches of 100)
                const maxMessages = 1000;
                let fetchedMessages;

                do {
                    fetchedMessages = await channel.messages.fetch({ limit: 100 });
                    const messagesToDelete = fetchedMessages.filter(msg => !msg.pinned && 
                        Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000); // Only messages < 14 days old

                    if (messagesToDelete.size > 0) {
                        await channel.bulkDelete(messagesToDelete, true);
                        deletedCount += messagesToDelete.size;
                    }

                    // Break if we fetched less than 100 messages (no more to delete)
                    if (fetchedMessages.size < 100) break;

                } while (deletedCount < maxMessages);
            }

            const embed = new EmbedBuilder()
                .setTitle(`${EMOJIS.SUCCESS} Messages Purged`)
                .setDescription(`Successfully deleted ${deletedCount} message${deletedCount !== 1 ? 's' : ''}.`)
                .setColor(COLORS.SUCCESS);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error purging messages:', error);
            const embed = new EmbedBuilder()
                .setTitle(`${EMOJIS.ERROR} Error`)
                .setDescription('An error occurred while purging messages. Make sure I have the necessary permissions.')
                .setColor(COLORS.ERROR);
            await interaction.editReply({ embeds: [embed] });
        }
    },
};
