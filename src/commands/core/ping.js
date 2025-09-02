const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../config/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and response time'),

    async execute(interaction) {
        const sent = await interaction.reply({ 
            content: 'Pinging...', 
            withResponse: true 
        });

        const timeDiff = sent.resource.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle('🏓 Pong!')
            .setColor(COLORS.SUCCESS)
            .addFields(
                { 
                    name: 'Bot Latency', 
                    value: `\`${timeDiff}ms\``, 
                    inline: true 
                },
                { 
                    name: 'API Latency', 
                    value: `\`${apiLatency}ms\``, 
                    inline: true 
                },
                { 
                    name: 'Status', 
                    value: '✅ Online', 
                    inline: true 
                }
            )
            .setTimestamp();

        await interaction.editReply({ 
            content: null, 
            embeds: [embed] 
        });
    }
};
