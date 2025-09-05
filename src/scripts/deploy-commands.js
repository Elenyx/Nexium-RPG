require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

async function deploy() {
    const commands = [];
    const commandsPath = path.join(__dirname, '..', 'commands');

    if (!fs.existsSync(commandsPath)) {
        console.error('Commands folder not found:', commandsPath);
        process.exit(1);
    }

    const folders = fs.readdirSync(commandsPath);
    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder);
        if (!fs.lstatSync(folderPath).isDirectory()) continue;
        const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);
            if (command && command.data) {
                commands.push(command.data.toJSON ? command.data.toJSON() : command.data);
            }
        }
    }

    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    if (!token || !clientId) {
        console.error('Missing DISCORD_TOKEN or CLIENT_ID in environment');
        process.exit(1);
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        if (guildId) {
            console.log(`Registering ${commands.length} commands to guild ${guildId}...`);
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            console.log('Successfully registered guild commands');
        } else {
            console.log(`Registering ${commands.length} global commands...`);
            await rest.put(Routes.applicationCommands(clientId), { body: commands });
            console.log('Successfully registered global commands');
        }
    } catch (err) {
        console.error('Failed to register commands:', err);
        process.exit(1);
    }
}

if (require.main === module) {
    deploy().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = deploy;
