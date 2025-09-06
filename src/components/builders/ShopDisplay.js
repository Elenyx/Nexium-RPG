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
    MessageFlags
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
        const embed = new EmbedBuilder()
            .setTitle(`${EMOJIS.COIN} Nexium Shop`)
            .setDescription('Welcome to the Dimensional Shop!\nBrowse and purchase items to enhance your journey.')
            .setColor(COLORS.SUCCESS)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                {
                    name: `${EMOJIS.COIN} Your Balance`,
                    value: `\`${userData.coins.toLocaleString()} coins\``,
                    inline: true
                },
                {
                    name: `${EMOJIS.ENERGY} Your Energy`,
                    value: `\`${userData.dimensionalEnergy}/${userData.maxEnergy}\``,
                    inline: true
                },
                {
                    name: '🛒 Shop Categories',
                    value: categories.map(cat => `${cat.emoji} ${cat.name}`).join('\n'),
                    inline: false
                }
            )
            .setFooter({ text: 'Select a category to start browsing • Use /profile to return' })
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`shop_category_${targetUser.id}`)
            .setPlaceholder('Choose a shop category...')
            .addOptions(
                ...categories.map(category => ({
                    label: category.name,
                    description: category.description,
                    value: category.id,
                    emoji: category.emoji
                }))
            );

        const row1 = new ActionRowBuilder()
            .addComponents(selectMenu);

        const row2 = new ActionRowBuilder()
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
            );

        return {
            embeds: [embed],
            components: [row1, row2],
            flags: MessageFlags.IsComponentsV2
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

        const embed = new EmbedBuilder()
            .setTitle(`${categoryEmojis[categoryId]} ${categoryNames[categoryId]} Shop`)
            .setDescription(`Browse ${categoryNames[categoryId].toLowerCase()} to enhance your adventure!`)
            .setColor(COLORS.PRIMARY)
            .setFooter({ text: `Page ${page}/${totalPages} • Balance: ${userData.coins.toLocaleString()} coins` });

        if (pageItems.length === 0) {
            embed.addFields({
                name: '📭 No Items Available',
                value: 'This category is currently empty. Check back later!',
                inline: false
            });
        } else {
            pageItems.forEach((item, index) => {
                const canAfford = userData.coins >= item.price;
                const priceText = canAfford
                    ? `${EMOJIS.COIN} ${item.price.toLocaleString()}`
                    : `~~${EMOJIS.COIN} ${item.price.toLocaleString()}~~ ❌`;

                embed.addFields({
                    name: `${item.emoji} ${item.name} ${canAfford ? '✅' : '❌'}`,
                    value: [
                        item.description,
                        `**Price:** ${priceText}`,
                        `**Effect:** ${item.effect || 'Special effect'}`,
                        `**ID:** ${item.id}`
                    ].join('\n'),
                    inline: true
                });
            });
        }

        const components = [];

        // Navigation row (if multiple pages)
        if (totalPages > 1) {
            const navRow = new ActionRowBuilder()
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
                );
            components.push(navRow);
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
                const row = new ActionRowBuilder()
                    .addComponents(buyButtons.slice(i, i + 5));
                components.push(row);
            }

            // Add back button
            const backRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`shop_back_cat_${targetUser.id}`)
                        .setLabel('Back to Categories')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji({ name: '⬅️' })
                );
            components.push(backRow);
        } else {
            // Default action row for other categories
            const actionRow = new ActionRowBuilder()
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
                );
            components.push(actionRow);
        }

        return {
            embeds: [embed],
            components: components,
            flags: MessageFlags.IsComponentsV2
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

        const embed = new EmbedBuilder()
            .setTitle('🛒 Purchase Confirmation')
            .setDescription(`Are you sure you want to purchase **${item.name}**?`)
            .setColor(canAfford ? COLORS.SUCCESS : COLORS.ERROR)
            .addFields(
                {
                    name: '📦 Item Details',
                    value: [
                        `**Name:** ${item.name}`,
                        `**Description:** ${item.description}`,
                        `**Effect:** ${item.effect || 'Special effect'}`,
                        `**Price:** ${EMOJIS.COIN} ${item.price.toLocaleString()}`
                    ].join('\n'),
                    inline: false
                },
                {
                    name: '💰 Your Balance',
                    value: [
                        `**Current:** ${EMOJIS.COIN} ${userData.coins.toLocaleString()}`,
                        `**After Purchase:** ${EMOJIS.COIN} ${(userData.coins - item.price).toLocaleString()}`,
                        canAfford ? '✅ You can afford this item' : '❌ Insufficient funds'
                    ].join('\n'),
                    inline: false
                }
            )
            .setFooter({ text: 'This action cannot be undone' })
            .setTimestamp();

        const row = new ActionRowBuilder()
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
            );

        return {
            embeds: [embed],
            components: [row],
            flags: MessageFlags.IsComponentsV2
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
        const embed = new EmbedBuilder()
            .setTitle('✅ Purchase Successful!')
            .setDescription(`Congratulations, ${targetUser.username}!`)
            .setColor(COLORS.SUCCESS)
            .addFields(
                {
                    name: '📦 Item Purchased',
                    value: `${item.emoji} **${item.name}**\n${item.description}`,
                    inline: false
                },
                {
                    name: '💰 Updated Balance',
                    value: `${EMOJIS.COIN} ${userData.coins.toLocaleString()} coins remaining`,
                    inline: true
                },
                {
                    name: '🎉 Effect Applied',
                    value: item.effect || 'Item effect has been applied to your account!',
                    inline: true
                }
            )
            .setFooter({ text: 'Thank you for shopping at Nexium Shop!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
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
            );

        return {
            embeds: [embed],
            components: [row],
            flags: MessageFlags.IsComponentsV2
        };
    }
}

module.exports = ShopDisplay;
