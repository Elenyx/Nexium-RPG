/**
 * @file Shop Button Handlers
 * @description Handles shop-related button interactions
 * @author Nexium Bot Development Team
 */

const ComponentRegistry = require('../ComponentRegistry');
const UserService = require('../../services/UserService');

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

            const embed = {
                title: '⭐ Featured Items',
                description: 'Check out our most popular items!',
                color: 0xF59E0B,
                fields: allItems.map(item => ({
                    name: `${item.emoji} ${item.name}`,
                    value: `${item.description}\n**Price:** ${item.price} coins`,
                    inline: true
                })),
                footer: { text: 'Select a category to browse more items' }
            };

            const categories = this.registry.getDefaultShopCategories();
            const row1 = {
                type: 1,
                components: categories.slice(0, 4).map(cat => ({
                    type: 2,
                    style: 2,
                    label: cat.name,
                    emoji: cat.emoji,
                    custom_id: `shop_category_${cat.id}_${userId}`
                }))
            };

            const row2 = {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 2,
                        label: 'Back to Shop',
                        emoji: '⬅️',
                        custom_id: `shop_back_cat_${userId}`
                    }
                ]
            };

            await interaction.editReply({
                embeds: [embed],
                components: [row1, row2],
                flags: 128
            });

        } catch (error) {
            console.error('Error handling featured items:', error);
            await interaction.editReply({
                content: 'An error occurred while loading featured items.',
                embeds: [],
                components: []
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

            const embed = {
                title: '🎯 Daily Deals',
                description: 'Limited time offers! These deals refresh daily.',
                color: 0xEF4444,
                fields: dailyDeals.map(deal => ({
                    name: `${deal.emoji} ${deal.name}`,
                    value: `${deal.description}\n~~${deal.originalPrice}~~ **${deal.dealPrice}** coins`,
                    inline: true
                })),
                footer: { text: 'Deals refresh every 24 hours • Limited time only!' }
            };

            const row1 = {
                type: 1,
                components: dailyDeals.map(deal => ({
                    type: 2,
                    style: 3,
                    label: `Buy ${deal.name.split(' ')[0]}`,
                    emoji: deal.emoji,
                    custom_id: `shop_purchase_deal_${deal.id}_${userId}`
                }))
            };

            const row2 = {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 2,
                        label: 'Back to Shop',
                        emoji: '⬅️',
                        custom_id: `shop_back_cat_${userId}`
                    }
                ]
            };

            await interaction.editReply({
                embeds: [embed],
                components: [row1, row2],
                flags: 128
            });

        } catch (error) {
            console.error('Error handling daily deals:', error);
            await interaction.editReply({
                content: 'An error occurred while loading daily deals.',
                embeds: [],
                components: []
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
            await profile.save();

            const successDisplay = this.registry.createPurchaseSuccess(item, profile, targetUser);
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
            const categories = this.registry.getDefaultShopCategories();
            const shopDisplay = this.registry.createShopInterface(categories, profile, targetUser);

            await interaction.editReply(shopDisplay);

        } catch (error) {
            console.error('Error handling shop back:', error);
            await interaction.editReply({
                content: 'An error occurred while returning to shop.',
                embeds: [],
                components: []
            });
        }
    }
}

module.exports = ShopButtonHandlers;
