/**
 * @file Test Auto Welcome System (test-auto-welcome.js)
 * @description Tests the automatic welcome banner system by simulating a user join event.
 * @author Nexium Bot Development Team
 */

require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, MessageFlags } = require('discord.js');
const DynamicBannerGenerator = require('./src/services/DynamicBannerGenerator');
const logger = require('./src/utils/logger');

async function testAutoWelcome() {
    console.log('🧪 Testing Auto Welcome System...\n');

    // Create a mock Discord client for testing
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.MessageContent
        ]
    });

    try {
        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
        console.log('✅ Connected to Discord');

        // Get the test guild (use GUILD_ID from .env or the first available guild)
        const testGuildId = process.env.GUILD_ID || process.env.TEST_GUILD_ID;
        const guild = client.guilds.cache.get(testGuildId);

        if (!guild) {
            console.log('❌ Test guild not found. Please set TEST_GUILD_ID in your .env file');
            console.log('Available guilds:');
            client.guilds.cache.forEach(g => {
                console.log(`- ${g.name} (${g.id})`);
            });
            await client.destroy();
            return;
        }

        console.log(`📍 Testing in guild: ${guild.name}`);

        // Find welcome channel
        let welcomeChannel = guild.channels.cache.find(channel =>
            channel.name.toLowerCase().includes('welcome') &&
            channel.type === 0
        );

        if (!welcomeChannel) {
            welcomeChannel = guild.channels.cache.find(channel =>
                (channel.name.toLowerCase().includes('general') ||
                 channel.name.toLowerCase().includes('main')) &&
                channel.type === 0
            );
        }

        if (!welcomeChannel) {
            console.log('❌ No suitable welcome channel found');
            await client.destroy();
            return;
        }

        console.log(`📢 Welcome channel: ${welcomeChannel.name}`);

        // Create a mock member object (using the bot itself for testing)
        const mockMember = {
            user: client.user,
            guild: guild,
            displayName: client.user.displayName,
            joinedAt: new Date()
        };

        console.log('🎨 Generating welcome banner...');

        // Generate welcome banner
        const bannerGenerator = new DynamicBannerGenerator();
        const bannerBuffer = await bannerGenerator.createWelcomeBanner(mockMember, {
            memberCount: guild.memberCount,
            name: guild.name
        }, {
            returnBuffer: true
        });

        if (!bannerBuffer) {
            console.log('❌ Failed to generate welcome banner');
            await client.destroy();
            return;
        }

        console.log('✅ Welcome banner generated successfully');

        // Create welcome embed
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`🌟 Welcome to ${guild.name}! 🌟`)
            .setDescription(`**${mockMember.displayName}** has joined our dimensional adventure! 🎉\n\nWe're excited to have you explore the multiverse with us!`)
            .setImage('attachment://welcome-banner.png')
            .setColor(0x7C3AED)
            .setTimestamp()
            .setFooter({
                text: 'Nexium RPG Bot - Auto Welcome Test',
                iconURL: guild.iconURL()
            });

        // Send test welcome message
        await welcomeChannel.send({
            content: '**🧪 AUTO WELCOME TEST**',
            embeds: [welcomeEmbed],
            files: [{
                attachment: bannerBuffer,
                name: 'welcome-banner.png'
            }],
            flags: MessageFlags.IsComponentsV2
        });

        console.log('✅ Test welcome message sent successfully!');
        console.log(`📍 Check the welcome message in ${welcomeChannel.name}`);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        // Clean up
        await client.destroy();
        console.log('\n🔚 Test completed');
    }
}

// Run the test
testAutoWelcome().catch(console.error);
