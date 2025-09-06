/**
 * @file Shop Component Builder
 * @description Creates interactive shop displays using Discord Components V2
 * @author Nexium Bot Development Team
 */

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder
} = require('discord.js');
const { COLORS, EMOJIS } = require('../../config/constants');

class ShopDisplay {
    /**
     * Creates the main shop interface
     * @param {Array} categories - Available shop categories
     * @param {Object} userData - User data for balance display
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Message options with shop interface
     */
    static createShopInterface(categories, userData, targetUser) {
        const container = new ContainerBuilder()
            .setAccentColor(COLORS.SUCCESS)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`# ${EMOJIS.COIN} Nexium Shop\nWelcome to the Dimensional Shop!\nBrowse and purchase items to enhance your journey.`)
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`${EMOJIS.COIN} **Your Balance:** \`${userData.coins.toLocaleString()} coins\`\n${EMOJIS.ENERGY} **Your Energy:** \`${userData.dimensionalEnergy}/${userData.maxEnergy}\``),
                        new TextDisplayBuilder()
                            .setContent(`🛒 **Shop Categories**\n${categories.map(cat => `${cat.emoji} ${cat.name}`).join('\n')}`)
                    )
                    .setButtonAccessory(
                        btn => btn
                            .setCustomId(`shop_info_${targetUser.id}`)
                            .setLabel('Shop Info')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: 'ℹ️' })
                    )
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`shop_category_${targetUser.id}`)
            .setPlaceholder('Choose a shop category...')
            .addOptions(
                ...categories.map(category => ({
                    label: category.name,
                    description: category.description,
                    value: category.id,
                    emoji: { name: category.emoji }
                }))
            );

        container.addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(selectMenu)
        );

        container.addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`shop_featured_${targetUser.id}`)
                        .setLabel('Featured Items')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji({ name: '⭐' }),
                    new ButtonBuilder()
                        .setCustomId(`shop_daily_${targetUser.id}`)
                        .setLabel('Daily Deals')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji({ name: '🎯' }),
                    new ButtonBuilder()
                        .setCustomId(`shop_back_${targetUser.id}`)
                        .setLabel('Back to Profile')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji({ name: '⬅️' })
                )
        );

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }

    /**
     * Creates a category-specific shop display
     * @param {string} categoryId - Shop category ID
     * @param {Array} items - Items in the category
     * @param {Object} userData - User data
     * @param {Object} targetUser - Discord user object
     * @param {number} page - Current page
     * @returns {Object} Message options with category items
     */
    static createCategoryDisplay(categoryId, items, userData, targetUser, page = 1) {
        const categoryNames = {
            'consumables': 'Consumables',
            'equipment': 'Equipment',
            'boosters': 'Boosters',
            'cosmetics': 'Cosmetics'
        };

        const categoryEmojis = {
            'consumables': '🧪',
            'equipment': '⚔️',
            'boosters': '⚡',
            'cosmetics': '🎨'
        };

        const startIndex = (page - 1) * 5;
        const endIndex = startIndex + 5;
        const pageItems = items.slice(startIndex, endIndex);
        const totalPages = Math.ceil(items.length / 5);

        const container = new ContainerBuilder()
            .setAccentColor(COLORS.PRIMARY)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`# ${categoryEmojis[categoryId]} ${categoryNames[categoryId]} Shop\nBrowse ${categoryNames[categoryId].toLowerCase()} to enhance your adventure!\n\n**Balance:** ${userData.coins.toLocaleString()} coins • **Page ${page}/${totalPages}**`)
            );

        if (pageItems.length === 0) {
            container.addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent('📭 **No Items Available**\nThis category is currently empty. Check back later!')
                    )
                    .setButtonAccessory(
                        btn => btn
                            .setCustomId(`shop_empty_${targetUser.id}`)
                            .setLabel('No Items')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    )
            );
        } else {
            pageItems.forEach((item, index) => {
                const canAfford = userData.coins >= item.price;
                const priceText = canAfford
                    ? `${EMOJIS.COIN} ${item.price.toLocaleString()}`
                    : `~~${EMOJIS.COIN} ${item.price.toLocaleString()}~~ ❌`;

                container.addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`${item.emoji} **${item.name}** ${canAfford ? '✅' : '❌'}\n${item.description}\n**Price:** ${priceText}\n**Effect:** ${item.effect || 'Special effect'}\n**ID:** ${item.id}`)
                        )
                        .setButtonAccessory(
                            btn => btn
                                .setCustomId(`shop_item_info_${item.id}_${targetUser.id}`)
                                .setLabel('View Item')
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji({ name: '👁️' })
                        )
                );
            });
        }

        const components = [];

        // Add navigation components to container
        if (totalPages > 1) {
            container.addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`shop_cat_prev_${categoryId}_${targetUser.id}_${page}`)
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '⬅️' })
                            .setDisabled(page === 1),
                        new ButtonBuilder()
                            .setCustomId(`shop_cat_page_${categoryId}_${targetUser.id}_${page}`)
                            .setLabel(`${page}/${totalPages}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId(`shop_cat_next_${categoryId}_${targetUser.id}_${page}`)
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '➡️' })
                            .setDisabled(page === totalPages)
                    )
            );
        }

        // Action row - different for cosmetics (frames)
        if (categoryId === 'cosmetics') {
            // Create individual buy buttons for frames
            const buyButtons = pageItems.map((item, index) => {
                const canAfford = userData.coins >= item.price;
                return new ButtonBuilder()
                    .setCustomId(`shop_buy_frame_${item.id}_${targetUser.id}`)
                    .setLabel(`Buy ${item.emoji}`)
                    .setStyle(canAfford ? ButtonStyle.Success : ButtonStyle.Secondary)
                    .setDisabled(!canAfford);
            });

            // Split buttons into rows of 5
            for (let i = 0; i < buyButtons.length; i += 5) {
                container.addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(buyButtons.slice(i, i + 5))
                );
            }

            // Add back button
            container.addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`shop_back_cat_${targetUser.id}`)
                            .setLabel('Back to Categories')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '⬅️' })
                    )
            );
        } else {
            // Default action row for other categories
            container.addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`shop_purchase_${categoryId}_${targetUser.id}`)
                            .setLabel('Purchase Item')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji({ name: '🛒' })
                            .setDisabled(pageItems.length === 0),
                        new ButtonBuilder()
                            .setCustomId(`shop_back_cat_${targetUser.id}`)
                            .setLabel('Back to Categories')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '⬅️' })
                    )
            );
        }

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }

    /**
     * Creates a purchase confirmation modal
     * @param {Object} item - Item to purchase
     * @param {Object} userData - User data
     * @param {string} userId - User ID
     * @returns {Object} Modal options
     */
    static createPurchaseModal(item, userData, userId) {
        const canAfford = userData.coins >= item.price;

        const container = new ContainerBuilder()
            .setAccentColor(canAfford ? COLORS.SUCCESS : COLORS.ERROR)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`# 🛒 Purchase Confirmation\nAre you sure you want to purchase **${item.name}**?`)
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`📦 **Item Details**\n**Name:** ${item.name}\n**Description:** ${item.description}\n**Effect:** ${item.effect || 'Special effect'}\n**Price:** ${EMOJIS.COIN} ${item.price.toLocaleString()}`)
                    )
                    .setButtonAccessory(
                        btn => btn
                            .setCustomId(`shop_item_details_${item.id}_${userId}`)
                            .setLabel('Item Details')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '📦' })
                    ),
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`💰 **Your Balance**\n**Current:** ${EMOJIS.COIN} ${userData.coins.toLocaleString()}\n**After Purchase:** ${EMOJIS.COIN} ${(userData.coins - item.price).toLocaleString()}\n${canAfford ? '✅ You can afford this item' : '❌ Insufficient funds'}`)
                    )
                    .setButtonAccessory(
                        btn => btn
                            .setCustomId(`shop_balance_${userId}`)
                            .setLabel('Check Balance')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '💰' })
                    )
            )
            .addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`shop_confirm_${item.id}_${userId}`)
                            .setLabel('Confirm Purchase')
                            .setStyle(ButtonStyle.Success)
                            .setEmoji({ name: '✅' })
                            .setDisabled(!canAfford),
                        new ButtonBuilder()
                            .setCustomId(`shop_cancel_${userId}`)
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '❌' })
                    )
            );

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }

    /**
     * Creates a purchase success message
     * @param {Object} item - Purchased item
     * @param {Object} userData - Updated user data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Success message options
     */
    static createPurchaseSuccess(item, userData, targetUser) {
        const container = new ContainerBuilder()
            .setAccentColor(COLORS.SUCCESS)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`# ✅ Purchase Successful!\nCongratulations, ${targetUser.username}!`)
            )
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`📦 **Item Purchased**\n${item.emoji} **${item.name}**\n${item.description}`)
                    )
                    .setButtonAccessory(
                        btn => btn
                            .setCustomId(`shop_purchased_item_${item.id}_${targetUser.id}`)
                            .setLabel('Purchased Item')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '📦' })
                    ),
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`💰 **Updated Balance**\n${EMOJIS.COIN} ${userData.coins.toLocaleString()} coins remaining\n\n🎉 **Effect Applied**\n${item.effect || 'Item effect has been applied to your account!'}`)
                    )
                    .setButtonAccessory(
                        btn => btn
                            .setCustomId(`shop_updated_balance_${targetUser.id}`)
                            .setLabel('Updated Balance')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '💰' })
                    )
            )
            .addActionRowComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`shop_continue_${targetUser.id}`)
                            .setLabel('Continue Shopping')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji({ name: '🛒' }),
                        new ButtonBuilder()
                            .setCustomId(`shop_back_profile_${targetUser.id}`)
                            .setLabel('Back to Profile')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji({ name: '⬅️' })
                    )
            );

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }
}

module.exports = ShopDisplay;
