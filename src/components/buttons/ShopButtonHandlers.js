/**
 * @file Shop Button Handlers
 * @description Handles shop-related button interactions
 * @author Nexium Bot Development Team
 */

const ComponentRegistry = require('../ComponentRegistry');
const UserService = require('../../services/UserService');
const { models } = require('../../database/connection');

class ShopButtonHandlers {
    constructor(client) {
        this.client = client;
        this.registry = new ComponentRegistry();
        this.userService = new UserService();
    }

    /**
     * Handles shop category selection
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleCategory(interaction, params) {
        const [categoryId, userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);
            const items = this.registry.getSampleShopItems(categoryId);
            const shopDisplay = this.registry.createShopCategory(categoryId, items, profile, targetUser, 1);

            // Edit with the prepared shop display. Do not unset the Components V2 flag here
            // (the flag cannot be removed from a message once set).
            await interaction.editReply(shopDisplay);

        } catch (error) {
            console.error('Error handling shop category:', error);
            await interaction.editReply({
                content: 'An error occurred while loading the shop category.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles shop featured items
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleFeatured(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            // Get featured items (top items from all categories)
            const allItems = [
                ...this.registry.getSampleShopItems('consumables'),
                ...this.registry.getSampleShopItems('equipment'),
                ...this.registry.getSampleShopItems('boosters')
            ].slice(0, 6); // Top 6 featured items

            const categories = this.registry.getDefaultShopCategories();

            const container = new (require('discord.js').ContainerBuilder)()
                .setAccentColor(0xF59E0B)
                .addTextDisplayComponents(
                    new (require('discord.js').TextDisplayBuilder)()
                        .setContent(`# ⭐ Featured Items\nCheck out our most popular items!`)
                )
                .addSectionComponents(
                    new (require('discord.js').SectionBuilder)()
                        .addTextDisplayComponents(
                            ...allItems.map(item =>
                                new (require('discord.js').TextDisplayBuilder)()
                                    .setContent(`${item.emoji} **${item.name}**\n${item.description}\n**Price:** ${item.price} coins`)
                            )
                        )
                );

            // Add category buttons
            const row1 = new (require('discord.js').ActionRowBuilder)()
                .addComponents(
                    ...categories.slice(0, 4).map(cat =>
                        new (require('discord.js').ButtonBuilder)()
                            .setCustomId(`shop_category_${cat.id}_${userId}`)
                            .setLabel(cat.name)
                            .setStyle(require('discord.js').ButtonStyle.Secondary)
                            .setEmoji(cat.emoji)
                    )
                );

            const row2 = new (require('discord.js').ActionRowBuilder)()
                .addComponents(
                    new (require('discord.js').ButtonBuilder)()
                        .setCustomId(`shop_back_cat_${userId}`)
                        .setLabel('Back to Shop')
                        .setStyle(require('discord.js').ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                );

            container.addActionRowComponents(row1, row2);

            await interaction.editReply({
                components: [container],
                flags: require('discord.js').MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Error handling featured items:', error);
            await interaction.editReply({
                content: 'An error occurred while loading featured items.',
                flags: require('discord.js').MessageFlags.Ephemeral
            });
        }
    }

    /**
     * Handles shop daily deals
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleDailyDeals(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            // Sample daily deals with discounts
            const dailyDeals = [
                {
                    id: 'daily_health_potion',
                    name: 'Health Potion (Daily Deal)',
                    originalPrice: 100,
                    dealPrice: 75,
                    description: 'Restores 50 HP instantly - 25% off today!',
                    effect: 'Restores 50 HP',
                    emoji: '❤️'
                },
                {
                    id: 'daily_energy_drink',
                    name: 'Energy Drink (Daily Deal)',
                    originalPrice: 75,
                    dealPrice: 50,
                    description: 'Restores 25 energy instantly - 33% off today!',
                    effect: 'Restores 25 energy',
                    emoji: '⚡'
                }
            ];

            const container = new (require('discord.js').ContainerBuilder)()
                .setAccentColor(0xEF4444)
                .addTextDisplayComponents(
                    new (require('discord.js').TextDisplayBuilder)()
                        .setContent(`# 🎯 Daily Deals\nLimited time offers! These deals refresh daily.`)
                )
                .addSectionComponents(
                    new (require('discord.js').SectionBuilder)()
                        .addTextDisplayComponents(
                            ...dailyDeals.map(deal =>
                                new (require('discord.js').TextDisplayBuilder)()
                                    .setContent(`${deal.emoji} **${deal.name}**\n${deal.description}\n~~${deal.originalPrice}~~ **${deal.dealPrice}** coins`)
                            )
                        )
                );

            const row1 = new (require('discord.js').ActionRowBuilder)()
                .addComponents(
                    ...dailyDeals.map(deal =>
                        new (require('discord.js').ButtonBuilder)()
                            .setCustomId(`shop_purchase_deal_${deal.id}_${userId}`)
                            .setLabel(`Buy ${deal.name.split(' ')[0]}`)
                            .setStyle(require('discord.js').ButtonStyle.Success)
                            .setEmoji(deal.emoji)
                    )
                );

            const row2 = new (require('discord.js').ActionRowBuilder)()
                .addComponents(
                    new (require('discord.js').ButtonBuilder)()
                        .setCustomId(`shop_back_cat_${userId}`)
                        .setLabel('Back to Shop')
                        .setStyle(require('discord.js').ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                );

            container.addActionRowComponents(row1, row2);

            await interaction.editReply({
                components: [container],
                flags: require('discord.js').MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Error handling daily deals:', error);
            await interaction.editReply({
                content: 'An error occurred while loading daily deals.',
                flags: require('discord.js').MessageFlags.Ephemeral
            });
        }
    }

    /**
     * Handles shop purchase button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handlePurchase(interaction, params) {
        const [categoryId, userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);
            const items = this.registry.getSampleShopItems(categoryId);

            if (items.length === 0) {
                await interaction.editReply({
                    content: 'No items available in this category.',
                    embeds: [],
                    components: []
                });
                return;
            }

            // Show first item as example
            const item = items[0];
            const purchaseDisplay = this.registry.createPurchaseConfirmation(item, profile, userId);

            // Send the purchase display without attempting to remove Components V2 flag.
            await interaction.editReply(purchaseDisplay);

        } catch (error) {
            console.error('Error handling purchase:', error);
            await interaction.editReply({
                content: 'An error occurred while processing your purchase.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles purchase confirmation
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handlePurchaseConfirm(interaction, params) {
        const [itemId, userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            // Find the item (in real implementation, this would come from database)
            const allItems = [
                ...this.registry.getSampleShopItems('consumables'),
                ...this.registry.getSampleShopItems('equipment'),
                ...this.registry.getSampleShopItems('boosters'),
                ...this.registry.getSampleShopItems('cosmetics')
            ];

            const item = allItems.find(i => i.id === itemId);

            if (!item) {
                await interaction.editReply({
                    content: 'Item not found.',
                    embeds: [],
                    components: []
                });
                return;
            }

            if (profile.coins < item.price) {
                await interaction.editReply({
                    content: 'Insufficient coins for this purchase.',
                    embeds: [],
                    components: []
                });
                return;
            }

            // Process purchase
            profile.coins -= item.price;
            await this.userService.updateUser(userId, { coins: profile.coins });

            // Special handling for frame purchases
            if (item.type === 'frame') {
                // Add frame to user's unlocked frames
                let userProfile = await models.UserProfile.findOne({
                    where: { userId: userId }
                });

                if (!userProfile) {
                    // Create user profile if it doesn't exist
                    userProfile = await models.UserProfile.create({
                        userId: userId,
                        unlockedFrames: [item.id],
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                } else {
                    // Add frame to unlocked frames if not already unlocked
                    const unlockedFrames = userProfile.unlockedFrames || [];
                    if (!unlockedFrames.includes(item.id)) {
                        unlockedFrames.push(item.id);
                        await userProfile.update({
                            unlockedFrames,
                            updatedAt: new Date()
                        });
                    }
                }
            }

            const successDisplay = this.registry.createPurchaseSuccess(item, profile, targetUser);
            // Send success display; keep Components V2 flag as provided by the builder.
            await interaction.editReply(successDisplay);

        } catch (error) {
            console.error('Error confirming purchase:', error);
            await interaction.editReply({
                content: 'An error occurred while processing your purchase.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles frame purchase button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleBuyFrame(interaction, params) {
        const [frameId, userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            // Find the frame item
            const cosmeticsItems = this.registry.getSampleShopItems('cosmetics');
            const item = cosmeticsItems.find(i => i.id === frameId);

            if (!item) {
                await interaction.editReply({
                    content: 'Frame not found.',
                    embeds: [],
                    components: []
                });
                return;
            }

            if (profile.coins < item.price) {
                await interaction.editReply({
                    content: 'Insufficient coins for this purchase.',
                    embeds: [],
                    components: []
                });
                return;
            }

            // Process purchase
            profile.coins -= item.price;
            await this.userService.updateUser(userId, { coins: profile.coins });

            // Add frame to user's unlocked frames
            const { models } = require('../../database/connection');
            if (models) {
                let userProfile = await models.UserProfile.findOne({
                    where: { userId: userId }
                });

                if (!userProfile) {
                    // Create user profile if it doesn't exist
                    userProfile = await models.UserProfile.create({
                        userId: userId,
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
                    }
                }
            }

            const successDisplay = this.registry.createPurchaseSuccess(item, profile, targetUser);
            await interaction.editReply(successDisplay);

        } catch (error) {
            console.error('Error handling frame purchase:', error);
            await interaction.editReply({
                content: 'An error occurred while processing your purchase.',
                embeds: [],
                components: []
            });
        }
    }

    /**
     * Handles shop back button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters
     */
    async handleBack(interaction, params) {
        const [userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            const shopDisplay = this.registry.createShopInterface(
                this.registry.getDefaultShopCategories(),
                profile,
                targetUser
            );

            await interaction.editReply(shopDisplay);

        } catch (error) {
            console.error('Error handling shop back:', error);
            await interaction.editReply({
                content: 'An error occurred while going back to the shop.',
                flags: require('discord.js').MessageFlags.Ephemeral
            });
        }
    }

    /**
     * Handles shop item info button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters [itemId, userId]
     */
    async handleItemInfo(interaction, params) {
        const [itemId, userId] = params;
        const targetUser = await this.client.users.fetch(userId);

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            // Find the item from all categories
            const allItems = [
                ...this.registry.getSampleShopItems('consumables'),
                ...this.registry.getSampleShopItems('equipment'),
                ...this.registry.getSampleShopItems('boosters'),
                ...this.registry.getSampleShopItems('cosmetics')
            ];

            const item = allItems.find(i => i.id === itemId);

            if (!item) {
                await interaction.editReply({
                    content: 'Item not found.',
                    flags: require('discord.js').MessageFlags.Ephemeral
                });
                return;
            }

            const canAfford = profile.coins >= item.price;

            const container = new (require('discord.js').ContainerBuilder)()
                .setAccentColor(canAfford ? 0x10B981 : 0xEF4444)
                .addTextDisplayComponents(
                    new (require('discord.js').TextDisplayBuilder)()
                        .setContent(`# ${item.emoji} ${item.name}\nDetailed item information`)
                )
                .addSectionComponents(
                    new (require('discord.js').SectionBuilder)()
                        .addTextDisplayComponents(
                            new (require('discord.js').TextDisplayBuilder)()
                                .setContent(`**Description:** ${item.description}\n**Effect:** ${item.effect || 'Special effect'}\n**Price:** ${item.price} coins\n**Can Afford:** ${canAfford ? '✅ Yes' : '❌ No'}`)
                        )
                );

            const row = new (require('discord.js').ActionRowBuilder)()
                .addComponents(
                    new (require('discord.js').ButtonBuilder)()
                        .setCustomId(`shop_purchase_${itemId}_${userId}`)
                        .setLabel('Purchase')
                        .setStyle(canAfford ? require('discord.js').ButtonStyle.Success : require('discord.js').ButtonStyle.Secondary)
                        .setDisabled(!canAfford)
                        .setEmoji('🛒'),
                    new (require('discord.js').ButtonBuilder)()
                        .setCustomId(`shop_back_cat_${userId}`)
                        .setLabel('Back')
                        .setStyle(require('discord.js').ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                );

            container.addActionRowComponents(row);

            await interaction.editReply({
                components: [container],
                flags: require('discord.js').MessageFlags.IsComponentsV2
            });

        } catch (error) {
            console.error('Error handling item info:', error);
            await interaction.editReply({
                content: 'An error occurred while loading item information.',
                flags: require('discord.js').MessageFlags.Ephemeral
            });
        }
    }

    /**
     * Handles shop category navigation (next/prev)
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters [action, categoryId, userId, page]
     */
    async handleCategoryNavigation(interaction, params) {
        const [action, categoryId, userId, pageStr] = params;
        const targetUser = await this.client.users.fetch(userId);
        const currentPage = parseInt(pageStr) || 1;

        try {
            await interaction.deferUpdate();

            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);
            const items = this.registry.getSampleShopItems(categoryId);

            let newPage = currentPage;
            if (action === 'next') {
                newPage = Math.min(currentPage + 1, Math.ceil(items.length / 5));
            } else if (action === 'prev') {
                newPage = Math.max(currentPage - 1, 1);
            }

            const shopDisplay = this.registry.createShopCategory(categoryId, items, profile, targetUser, newPage);

            await interaction.editReply(shopDisplay);

        } catch (error) {
            console.error('Error handling category navigation:', error);
            await interaction.editReply({
                content: 'An error occurred while navigating categories.',
                flags: require('discord.js').MessageFlags.Ephemeral
            });
        }
    }

    /**
     * Handles shop info button
     * @param {Object} interaction - Discord interaction
     * @param {Array} params - Button parameters [userId]
     */
    async handleShopInfo(interaction, params) {
        // support both public and ephemeral variants
        // params can be: [userId] or ['ephemeral', userId]
        const isEphemeral = params && params[0] === 'ephemeral';
        const userId = isEphemeral ? params[1] : params[0];
        const targetUser = await this.client.users.fetch(userId);

        try {
            // If showing publicly, defer the update and edit the original reply.
            // If ephemeral, reply directly to the user (private message-like ephemeral reply).
            const profile = await this.userService.getOrCreateUser(userId, targetUser.username);

            const { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ActionRowBuilder, ButtonBuilder, MessageFlags } = require('discord.js');

            const container = new ContainerBuilder()
                .setAccentColor(0x3B82F6)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('# 🛒 Nexium Shop — Quick Guide')
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`**Currency:** Coins = spend on items. Shards = premium currency for X.`),
                            new TextDisplayBuilder()
                                .setContent(`**How to buy:** Click item → Confirm Purchase → Item applied. Purchases are immediate; no refunds.`),
                            new TextDisplayBuilder()
                                .setContent(`**Featured/Daily:** Featured items are curated; daily deals refresh every 24h.`),
                            new TextDisplayBuilder()
                                .setContent(`**Frames:** Frames unlock visual card frames. They are stored in your profile's unlockedFrames.`),
                            new TextDisplayBuilder()
                                .setContent(`**Limits & notes:** Some items are one-time, some stack; pages show up to 5 items; use navigation buttons.`),
                            new TextDisplayBuilder()
                                .setContent(`**Support:** Use /support if you see a bug or incorrect charge.`)
                        )
                );

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`shop_featured_${userId}`)
                        .setLabel('Featured Items')
                        .setStyle(require('discord.js').ButtonStyle.Primary)
                        .setEmoji('⭐'),
                    new ButtonBuilder()
                        .setCustomId(`shop_daily_${userId}`)
                        .setLabel('Daily Deals')
                        .setStyle(require('discord.js').ButtonStyle.Success)
                        .setEmoji('🎯'),
                    new ButtonBuilder()
                        .setCustomId(`shop_back_${userId}`)
                        .setLabel('Back to Profile')
                        .setStyle(require('discord.js').ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                );

            container.addActionRowComponents(row);

            if (isEphemeral) {
                // send a private ephemeral reply to the clicking user
                await interaction.reply({
                    components: [container],
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.deferUpdate();
                await interaction.editReply({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2
                });
            }

        } catch (error) {
            console.error('Error handling shop info:', error);
            try {
                await interaction.editReply({
                    content: 'An error occurred while loading shop information.',
                    flags: require('discord.js').MessageFlags.Ephemeral
                });
            } catch (e) {
                // fallback: try reply
                await interaction.reply({
                    content: 'An error occurred while loading shop information.',
                    flags: require('discord.js').MessageFlags.Ephemeral
                });
            }
        }
    }
}

module.exports = ShopButtonHandlers;
