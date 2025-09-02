const { Collection } = require('discord.js');
const logger = require('../../utils/logger');
const ProfileButtonHandlers = require('./ProfileButtonHandlers');
const ShopButtonHandlers = require('./ShopButtonHandlers');
const CollectionButtonHandlers = require('./CollectionButtonHandlers');

class ButtonHandler {
    constructor(client) {
        this.client = client;
        this.profileHandlers = new ProfileButtonHandlers(client);
        this.shopHandlers = new ShopButtonHandlers(client);
        this.collectionHandlers = new CollectionButtonHandlers();
    }

    async handle(interaction) {
        if (!interaction.isButton()) return;

        const [category, action, ...params] = interaction.customId.split('_');

        try {
            // Route to appropriate handler based on category
            let handlerResult = false;

            switch (category) {
                case 'profile':
                    handlerResult = await this.handleProfileButton(action, interaction, params);
                    break;
                case 'shop':
                    handlerResult = await this.handleShopButton(action, interaction, params);
                    break;
                case 'collection':
                    handlerResult = await this.handleCollectionButton(action, interaction, params);
                    break;
                case 'battle':
                    handlerResult = await this.handleBattleButton(action, interaction, params);
                    break;
                default:
                    // Check if button handler exists in client.buttons
                    const handler = this.client.buttons.get(`${category}_${action}`);
                    if (handler) {
                        await handler.execute(interaction, params);
                        handlerResult = true;
                    }
                    break;
            }

            if (!handlerResult) {
                logger.warn(`No handler found for button: ${interaction.customId}`);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: 'This button is no longer active.',
                        ephemeral: true
                    });
                }
            }

        } catch (error) {
            logger.error(`Button handling error: ${error}`);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while processing this button.',
                    ephemeral: true
                });
            }
        }
    }

    /**
     * Handles profile-related buttons
     * @param {string} action - Button action
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     * @returns {boolean} Whether the button was handled
     */
    async handleProfileButton(action, interaction, params) {
        switch (action) {
            case 'inventory':
                await this.profileHandlers.handleInventory(interaction, params);
                return true;
            case 'collection':
                await this.profileHandlers.handleCollection(interaction, params);
                return true;
            case 'stats':
                await this.profileHandlers.handleStats(interaction, params);
                return true;
            case 'daily':
                await this.profileHandlers.handleDaily(interaction, params);
                return true;
            case 'shop':
                await this.profileHandlers.handleShop(interaction, params);
                return true;
            case 'back':
                await this.profileHandlers.handleBack(interaction, params);
                return true;
            case 'switch':
                await this.profileHandlers.handleCollectionSwitch(interaction, params);
                return true;
            case 'switch_modern':
                await this.profileHandlers.handleCollectionSwitchModern(interaction, params);
                return true;
            default:
                return false;
        }
    }

    /**
     * Handles shop-related buttons
     * @param {string} action - Button action
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     * @returns {boolean} Whether the button was handled
     */
    async handleShopButton(action, interaction, params) {
        switch (action) {
            case 'category':
                await this.shopHandlers.handleCategory(interaction, params);
                return true;
            case 'featured':
                await this.shopHandlers.handleFeatured(interaction, params);
                return true;
            case 'daily':
                await this.shopHandlers.handleDailyDeals(interaction, params);
                return true;
            case 'purchase':
                await this.shopHandlers.handlePurchase(interaction, params);
                return true;
            case 'confirm':
                await this.shopHandlers.handlePurchaseConfirm(interaction, params);
                return true;
            case 'back':
            case 'continue':
            case 'backprofile':
                await this.shopHandlers.handleBack(interaction, params);
                return true;
            default:
                return false;
        }
    }

    /**
     * Handles collection-related buttons
     * @param {string} action - Button action
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     * @returns {boolean} Whether the button was handled
     */
    async handleCollectionButton(action, interaction, params) {
        // Reconstruct the full customId for the collection handler
        const fullCustomId = `collection_${action}_${params.join('_')}`;
        if (this.collectionHandlers.canHandle(fullCustomId)) {
            await this.collectionHandlers.handle(interaction);
            return true;
        }
        return false;
    }

    /**
     * Handles battle-related buttons
     * @param {string} action - Button action
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     * @returns {boolean} Whether the button was handled
     */
    async handleBattleButton(action, interaction, params) {
        // TODO: Implement battle button handlers
        logger.info(`Battle button not yet implemented: ${action}`);
        return false;
    }
}

module.exports = ButtonHandler;
