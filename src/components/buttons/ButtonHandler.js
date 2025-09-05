const { Collection } = require('discord.js');
const logger = require('../../utils/logger');
const ProfileButtonHandlers = require('./ProfileButtonHandlers');
const ShopButtonHandlers = require('./ShopButtonHandlers');
const CollectionButtonHandlers = require('./CollectionButtonHandlers');
const UpgradeButtonHandlers = require('./UpgradeButtonHandlers');

class ButtonHandler {
    constructor(client) {
        this.client = client;
        this.profileHandlers = new ProfileButtonHandlers(client);
        this.shopHandlers = new ShopButtonHandlers(client);
        this.collectionHandlers = new CollectionButtonHandlers();
        this.upgradeHandlers = new UpgradeButtonHandlers(client);
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
                case 'upgrade':
                    handlerResult = await this.handleUpgradeButton(action, interaction, params);
                    break;
                case 'inventory':
                    handlerResult = await this.handleInventoryButton(action, interaction, params);
                    break;
                default:
                    // Handle special cases
                    if (interaction.customId === 'collection_view_battle') {
                        handlerResult = await this.handleViewCollectionFromBattle(interaction);
                    } else if (interaction.customId === 'battle_back_from_collection') {
                        handlerResult = await this.handleBackToBattleFromCollection(interaction);
                    } else {
                        // Check if button handler exists in client.buttons
                        const handler = this.client.buttons.get(`${category}_${action}`);
                        if (handler) {
                            await handler.execute(interaction, params);
                            handlerResult = true;
                        }
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
        switch (action) {
            case 'rematch':
                await this.handleRematch(interaction, params);
                return true;
            case 'swap':
                await this.handleSwapBattle(interaction, params);
                return true;
            default:
                return false;
        }
    }

    /**
     * Handles upgrade-related buttons
     * @param {string} action - Button action
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     * @returns {boolean} Whether the button was handled
     */
    async handleUpgradeButton(action, interaction, params) {
        // Reconstruct the full customId for the upgrade handler
        const fullCustomId = `upgrade_${action}_${params.join('_')}`;
        if (this.upgradeHandlers.canHandle(fullCustomId)) {
            await this.upgradeHandlers.handle(interaction);
            return true;
        }
        return false;
    }

    /**
     * Handles rematch button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - [char1Id, char2Id]
     */
    async handleRematch(interaction, params) {
        const [char1Id, char2Id] = params;
        const userId = interaction.user.id;

        try {
            await interaction.deferUpdate();

            const BattleService = new (require('../../services/BattleService'))();
            const battleResult = await BattleService.startBattle(userId, char1Id, char2Id);

            // Create updated battle result embed
            const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
            const { COLORS, EMOJIS } = require('../../config/constants');

            const embed = new EmbedBuilder()
                .setColor(battleResult.battle.isDraw ? COLORS.WARNING : COLORS.SUCCESS)
                .setTitle(`${EMOJIS.BATTLE} Battle Results (Rematch)`)
                .setDescription(
                    battleResult.battle.isDraw
                        ? '🤝 The battle ended in a draw!'
                        : `🏆 **${battleResult.battle.winner.name}** wins the battle!`
                )
                .addFields(
                    {
                        name: '⚔️ Participants',
                        value: [
                            `**${battleResult.participants.char1.name}** (Lv.${battleResult.participants.char1.customLevel})`,
                            `**${battleResult.participants.char2.name}** (Lv.${battleResult.participants.char2.customLevel})`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '📊 Battle Stats',
                        value: [
                            `**Turns:** ${battleResult.battle.totalTurns}`,
                            `**Final HP:**`,
                            `${battleResult.participants.char1.name}: ${battleResult.battle.finalHp[battleResult.participants.char1.name]}`,
                            `${battleResult.participants.char2.name}: ${battleResult.battle.finalHp[battleResult.participants.char2.name]}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🎁 Rewards',
                        value: [
                            `**EXP:** +${battleResult.rewards.exp}`,
                            `**Coins:** +${battleResult.rewards.coins}`
                        ].join('\n'),
                        inline: true
                    }
                )
                .setFooter({
                    text: 'Use /battle again to try different matchups!',
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            // Add same buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`rematch_${char1Id}_${char2Id}`)
                        .setLabel('Rematch')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('🔄'),
                    new ButtonBuilder()
                        .setCustomId(`swap_battle_${char1Id}_${char2Id}`)
                        .setLabel('Swap & Battle')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🔀'),
                    new ButtonBuilder()
                        .setCustomId('collection_view_battle')
                        .setLabel('View Collection')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📚')
                );

            await interaction.editReply({ embeds: [embed], components: [row] });

        } catch (error) {
            logger.error(`Rematch error: ${error}`);
            await interaction.editReply({
                content: 'An error occurred during the rematch.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles swap and battle button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - [char1Id, char2Id]
     */
    async handleSwapBattle(interaction, params) {
        const [char1Id, char2Id] = params;
        const userId = interaction.user.id;

        try {
            await interaction.deferUpdate();

            const BattleService = new (require('../../services/BattleService'))();
            // Swap the characters
            const battleResult = await BattleService.startBattle(userId, char2Id, char1Id);

            // Create updated battle result embed
            const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
            const { COLORS, EMOJIS } = require('../../config/constants');

            const embed = new EmbedBuilder()
                .setColor(battleResult.battle.isDraw ? COLORS.WARNING : COLORS.SUCCESS)
                .setTitle(`${EMOJIS.BATTLE} Battle Results (Swapped)`)
                .setDescription(
                    battleResult.battle.isDraw
                        ? '🤝 The battle ended in a draw!'
                        : `🏆 **${battleResult.battle.winner.name}** wins the battle!`
                )
                .addFields(
                    {
                        name: '⚔️ Participants',
                        value: [
                            `**${battleResult.participants.char1.name}** (Lv.${battleResult.participants.char1.customLevel})`,
                            `**${battleResult.participants.char2.name}** (Lv.${battleResult.participants.char2.customLevel})`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '📊 Battle Stats',
                        value: [
                            `**Turns:** ${battleResult.battle.totalTurns}`,
                            `**Final HP:**`,
                            `${battleResult.participants.char1.name}: ${battleResult.battle.finalHp[battleResult.participants.char1.name]}`,
                            `${battleResult.participants.char2.name}: ${battleResult.battle.finalHp[battleResult.participants.char2.name]}`
                        ].join('\n'),
                        inline: true
                    },
                    {
                        name: '🎁 Rewards',
                        value: [
                            `**EXP:** +${battleResult.rewards.exp}`,
                            `**Coins:** +${battleResult.rewards.coins}`
                        ].join('\n'),
                        inline: true
                    }
                )
                .setFooter({
                    text: 'Use /battle again to try different matchups!',
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            // Add same buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`rematch_${char2Id}_${char1Id}`)
                        .setLabel('Rematch')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('🔄'),
                    new ButtonBuilder()
                        .setCustomId(`swap_battle_${char2Id}_${char1Id}`)
                        .setLabel('Swap & Battle')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🔀'),
                    new ButtonBuilder()
                        .setCustomId('collection_view_battle')
                        .setLabel('View Collection')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📚')
                );

            await interaction.editReply({ embeds: [embed], components: [row] });

        } catch (error) {
            logger.error(`Swap battle error: ${error}`);
            await interaction.editReply({
                content: 'An error occurred during the swapped battle.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles view collection from battle button
     * @param {Object} interaction - Discord interaction
     */
    async handleViewCollectionFromBattle(interaction) {
        const userId = interaction.user.id;

        try {
            await interaction.deferUpdate();

            const { models } = require('../../database/connection');
            const CardAlbum = require('../../services/CardAlbum');
            const { COLORS, EMOJIS } = require('../../config/constants');
            const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

            // Check if database is available
            if (!models) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Database Unavailable`)
                    .setDescription('The database is not configured.');
                return await interaction.editReply({ embeds: [embed], components: [] });
            }

            // Get user's characters
            const userCharacters = await models.UserCharacter.findAll({
                where: { userId: userId },
                include: [{
                    model: models.Character,
                    as: 'character',
                    attributes: ['id', 'name', 'rarity', 'imagePath', 'imageUrl', 'imageUrls', 'anime']
                }],
                attributes: ['customLevel', 'isFavorite', 'collectedShards'],
                order: [['character', 'rarity', 'DESC'], ['character', 'name', 'ASC']]
            });

            if (userCharacters.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(COLORS.ERROR)
                    .setTitle(`${EMOJIS.ERROR} Empty Collection`)
                    .setDescription("You haven't collected any characters yet!\n\nStart collecting characters to build your album!");
                return await interaction.editReply({ embeds: [embed], components: [] });
            }

            // Transform data for CardAlbum
            const characters = userCharacters.map(uc => ({
                id: uc.character.id,
                name: uc.character.name,
                rarity: uc.character.rarity,
                imagePath: uc.character.imagePath,
                imageUrl: uc.character.imageUrl,
                imageUrls: uc.character.imageUrls,
                anime: uc.character.anime,
                customLevel: uc.customLevel,
                isFavorite: uc.isFavorite,
                collectedShards: uc.collectedShards
            }));

            // Generate the card album image
            const cardAlbum = new CardAlbum();
            const albumBuffer = await cardAlbum.generateAlbum(characters, 0, {
                id: interaction.user.id,
                username: interaction.user.username
            });

            const embed = new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle(`${EMOJIS.COLLECTION} ${interaction.user.username}'s Collection`)
                .setDescription(`**Total Characters:** ${characters.length}`)
                .setImage('attachment://collection.png')
                .setFooter({
                    text: 'Use /collection for full pagination',
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            // Add back to battle button
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('battle_back_from_collection')
                        .setLabel('Back to Battle')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⚔️')
                );

            await interaction.editReply({
                embeds: [embed],
                files: [{ attachment: albumBuffer, name: 'collection.png' }],
                components: [row]
            });

        } catch (error) {
            logger.error(`View collection from battle error: ${error}`);
            await interaction.editReply({
                content: 'An error occurred while loading your collection.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles back to battle from collection button
     * @param {Object} interaction - Discord interaction
     */
    async handleBackToBattleFromCollection(interaction) {
        try {
            await interaction.deferUpdate();

            const { EmbedBuilder } = require('discord.js');
            const { COLORS, EMOJIS } = require('../../config/constants');

            const embed = new EmbedBuilder()
                .setColor(COLORS.INFO)
                .setTitle(`${EMOJIS.BATTLE} Battle System`)
                .setDescription('Use `/battle <character1> <character2>` to start a new battle!\n\nChoose two different characters from your collection to battle them against each other.')
                .setFooter({
                    text: 'Select characters by their IDs from your collection',
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed],
                files: [],
                components: []
            });

        } catch (error) {
            logger.error(`Back to battle from collection error: ${error}`);
            await interaction.editReply({
                content: 'An error occurred.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles inventory-related buttons
     * @param {string} action - Button action
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     * @returns {boolean} Whether the button was handled
     */
    async handleInventoryButton(action, interaction, params) {
        try {
            await interaction.deferUpdate();

            const { EmbedBuilder, MessageFlags } = require('discord.js');
            const { COLORS, EMOJIS } = require('../../config/constants');

            let responseMessage = '';

            switch (action) {
                case 'use':
                    responseMessage = 'Item usage feature coming soon!';
                    break;
                case 'equip':
                    responseMessage = 'Equipment feature coming soon!';
                    break;
                case 'sell':
                    responseMessage = 'Item selling feature coming soon!';
                    break;
                default:
                    responseMessage = 'Unknown inventory action.';
            }

            const embed = new EmbedBuilder()
                .setColor(COLORS.INFO)
                .setTitle(`${EMOJIS.INVENTORY} Inventory Action`)
                .setDescription(responseMessage)
                .setFooter({
                    text: 'Feature under development',
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed],
                components: []
            });

            return true;
        } catch (error) {
            logger.error(`Inventory button handling error: ${error}`);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'An error occurred while processing this inventory action.',
                    flags: MessageFlags.Ephemeral
                });
            }
            return false;
        }
    }
}

module.exports = ButtonHandler;
