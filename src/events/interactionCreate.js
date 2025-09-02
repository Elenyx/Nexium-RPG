const { Events, MessageFlags } = require('discord.js');
const ButtonHandler = require('../components/buttons/ButtonHandler');
const ModalHandler = require('../components/modals/ModalHandler');
const SelectMenuHandler = require('../components/selectMenus/SelectMenuHandler');
const logger = require('../utils/logger');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                logger.warn(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                logger.error(`Error executing command ${interaction.commandName}:`, error);

                const errorMessage = 'There was an error while executing this command!';

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMessage, flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral });
                }
            }
        }

        // Handle Components V2
        else if (interaction.isButton()) {
            const buttonHandler = new ButtonHandler(interaction.client);
            await buttonHandler.handle(interaction);
        }

        else if (interaction.isModalSubmit()) {
            const modalHandler = new ModalHandler(interaction.client);
            await modalHandler.handle(interaction);
        }

        else if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu() ||
                 interaction.isRoleSelectMenu() || interaction.isChannelSelectMenu()) {
            const selectMenuHandler = new SelectMenuHandler(interaction.client);
            await selectMenuHandler.handle(interaction);
        }

        // Handle autocomplete
        else if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                logger.warn(`No autocomplete matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                logger.error(`Error executing autocomplete ${interaction.commandName}:`, error);
            }
        }
    }
};
