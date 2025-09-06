/**
 * @file Character Collection Component Builder
 * @description Creates interactive character collection displays using Discord Components V2
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
    SectionBuilder,
    TextDisplayBuilder,
    ThumbnailBuilder
} = require('discord.js');
const { COLORS, EMOJIS } = require('../../config/constants');
const CharacterImageManager = require('./CharacterImageManager');

class CharacterCollection {
    /**
     * Creates a character collection embed with pagination
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Message options with embed and components
     */
    static createCollectionEmbed(characters, targetUser, page = 1, totalPages = 1) {
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        const pageCharacters = characters.slice(startIndex, endIndex);

        const embed = new EmbedBuilder()
            .setTitle(`${EMOJIS.SUMMON} Character Collection`)
            .setDescription(`**${targetUser.username}**'s anime character collection\nShowing ${startIndex + 1}-${Math.min(endIndex, characters.length)} of ${characters.length} characters`)
            .setColor(COLORS.PRIMARY)
            .setFooter({ text: `Page ${page}/${totalPages} • Use the buttons below to navigate` });

        // Set thumbnail if targetUser has displayAvatarURL method (real Discord user)
        if (typeof targetUser.displayAvatarURL === 'function') {
            embed.setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));
        }

        if (pageCharacters.length === 0) {
            embed.addFields({
                name: '📭 No Characters Found',
                value: 'You haven\'t collected any characters yet!\nUse `/summon` to get your first character.',
                inline: false
            });
        } else {
            // Group characters by rarity for better display
            const rarities = {
                'DIMENSIONAL': [],
                'MYTHIC': [],
                'LEGENDARY': [],
                'EPIC': [],
                'RARE': [],
                'COMMON': []
            };

            pageCharacters.forEach(char => {
                const rarity = char.rarity || 'COMMON';
                if (rarities[rarity]) {
                    rarities[rarity].push(char);
                }
            });

            Object.entries(rarities).forEach(([rarity, chars]) => {
                if (chars.length > 0) {
                    const emoji = this.getRarityEmoji(rarity);
                    const charList = chars.map(char =>
                        `${emoji} **${char.name}** (Lv.${char.customLevel || char.level || 1})`
                    ).join('\n');

                    embed.addFields({
                        name: `${this.getRarityEmoji(rarity)} ${rarity} Characters`,
                        value: charList.length > 1024 ? charList.substring(0, 1021) + '...' : charList,
                        inline: false
                    });
                }
            });
        }

        const components = [];

        // Navigation row
        if (totalPages > 1) {
            const navRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`collection_prev_${targetUser.id}_${page}`)
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId(`collection_page_${targetUser.id}_${page}`)
                        .setLabel(`${page}/${totalPages}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId(`collection_next_${targetUser.id}_${page}`)
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('➡️')
                        .setDisabled(page === totalPages)
                );
            components.push(navRow);
        }

        // Action row
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`collection_summon_${targetUser.id}`)
                    .setLabel('Summon Character')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎴'),
                new ButtonBuilder()
                    .setCustomId(`collection_filter_${targetUser.id}`)
                    .setLabel('Filter by Rarity')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new ButtonBuilder()
                    .setCustomId(`collection_switch_modern_${targetUser.id}`)
                    .setLabel('Modern View')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🖼️'),
                new ButtonBuilder()
                    .setCustomId(`collection_back_${targetUser.id}`)
                    .setLabel('Back to Profile')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );
        components.push(actionRow);

        return {
            components: components,
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }

    /**
     * Creates a modern character collection using ContainerBuilder (Components V2)
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Message options with modern components
     */
    static async createModernCollectionEmbed(characters, targetUser, page = 1, totalPages = 1) {
        const startIndex = (page - 1) * 6; // Show fewer characters per page for better visual layout
        const endIndex = startIndex + 6;
        const pageCharacters = characters.slice(startIndex, endIndex);

        const components = [];
        const files = [];

        // Initialize image manager
        const imageManager = new CharacterImageManager();

        // Header container with engaging description
        const headerContainer = new ContainerBuilder()
            .setAccentColor(COLORS.PRIMARY)
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`🎴 **${targetUser.username}'s Anime Character Collection**`),
                new TextDisplayBuilder()
                    .setContent(`**Page ${page}/${totalPages}** • **${characters.length}** total characters collected!`),
                new TextDisplayBuilder()
                    .setContent(`Discover rare and legendary anime characters in your collection. Each character has unique abilities and powers!`)
            );
        components.push(headerContainer);

        if (pageCharacters.length === 0) {
            const emptyContainer = new ContainerBuilder()
                .setAccentColor(COLORS.WARNING)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('📭 **No Characters Yet!**'),
                    new TextDisplayBuilder().setContent('Your collection is waiting for its first legendary warrior!'),
                    new TextDisplayBuilder().setContent('Use the **Summon Character** button below to begin your anime adventure! 🎯')
                );
            components.push(emptyContainer);
        } else {
            // Group characters by rarity
            const rarities = this.groupCharactersByRarity(pageCharacters);

            // Create containers for each rarity
            for (const [rarity, chars] of Object.entries(rarities)) {
                if (chars.length > 0) {
                    const rarityContainer = new ContainerBuilder()
                        .setAccentColor(this.getRarityColor(rarity))
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`${this.getRarityEmoji(rarity)} ${rarity} Characters (${chars.length})`)
                        );

                    // Add character sections with images
                    for (const char of chars) {
                        const section = new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`**${char.name}**`),
                                new TextDisplayBuilder()
                                    .setContent(`⭐ **Level ${char.customLevel || char.level || 1}** • *${char.anime || 'Mysterious Origins'}*`),
                                new TextDisplayBuilder()
                                    .setContent(`⚔️ **${char.rarity || 'COMMON'}** rarity • Power: ${char.power || 'Unknown'}`)
                            );

                        // Load character image URL (no attachments for Components V2)
                        try {
                            const imageResult = await imageManager.loadCharacterImage(char);
                            if (imageResult.success && imageResult.url) {
                                // Use external URL for thumbnail (no downloadable files!)
                                section.setThumbnailAccessory(
                                    new ThumbnailBuilder()
                                        .setURL(imageResult.url)
                                        .setDescription(`${char.name} character image`)
                                );
                            } else if (char.imageUrl) {
                                // Fallback to character's imageUrl
                                section.setThumbnailAccessory(
                                    new ThumbnailBuilder()
                                        .setURL(char.imageUrl)
                                        .setDescription(`${char.name} character image`)
                                );
                            } else {
                                // No image available - section will display without thumbnail
                                console.log(`No image available for ${char.name} - displaying without thumbnail`);
                            }
                        } catch (error) {
                            console.warn(`Failed to load image for character ${char.name}:`, error.message);
                            // Continue without image if loading fails
                        }

                        rarityContainer.addSectionComponents(section);
                    }

                    components.push(rarityContainer);
                }
            }
        }

        // Add navigation and action components as ActionRows (not in containers for Components V2)
        const actionComponents = [];

        // Navigation row
        if (totalPages > 1) {
            const navRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`collection_prev_${targetUser.id}_${page}`)
                        .setLabel('Previous')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⬅️')
                        .setDisabled(page === 1),
                    new ButtonBuilder()
                        .setCustomId(`collection_page_${targetUser.id}_${page}`)
                        .setLabel(`${page}/${totalPages}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId(`collection_next_${targetUser.id}_${page}`)
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('➡️')
                        .setDisabled(page === totalPages)
                );
            actionComponents.push(navRow);
        }

        // Action row
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`collection_summon_${targetUser.id}`)
                    .setLabel('Summon Character')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎴'),
                new ButtonBuilder()
                    .setCustomId(`collection_filter_${targetUser.id}`)
                    .setLabel('Filter by Rarity')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔍'),
                new ButtonBuilder()
                    .setCustomId(`collection_switch_${targetUser.id}`)
                    .setLabel('Classic View')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📄'),
                new ButtonBuilder()
                    .setCustomId(`collection_back_${targetUser.id}`)
                    .setLabel('Back to Profile')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );
        actionComponents.push(actionRow);

        // Combine all components
        const allComponents = [...components, ...actionComponents];

        return {
            components: allComponents,
            flags: MessageFlags.IsComponentsV2,
            embeds: []
            // NO files array - this prevents downloadable attachments!
        };
    }

    /**
     * Formats characters for embed display
     * @param {Array} characters - Array of characters to format
     * @returns {Array} Array of embed fields
     */
    static formatCharactersForEmbed(characters) {
        const fields = [];
        const rarities = this.groupCharactersByRarity(characters);

        for (const [rarity, chars] of Object.entries(rarities)) {
            if (chars.length > 0) {
                const emoji = this.getRarityEmoji(rarity);
                const charList = chars.map(char =>
                    `${emoji} **${char.name}** (Lv.${char.level})`
                ).join('\n');

                fields.push({
                    name: `${this.getRarityEmoji(rarity)} ${rarity} Characters (${chars.length})`,
                    value: charList.length > 1024 ? charList.substring(0, 1021) + '...' : charList,
                    inline: false
                });
            }
        }

        return fields;
    }

    /**
     * Groups characters by rarity
     * @param {Array} characters - Array of characters
     * @returns {Object} Characters grouped by rarity
     */
    static groupCharactersByRarity(characters) {
        const rarities = {
            'DIMENSIONAL': [],
            'MYTHIC': [],
            'LEGENDARY': [],
            'EPIC': [],
            'RARE': [],
            'COMMON': []
        };

        characters.forEach(char => {
            const rarity = char.rarity || 'COMMON';
            if (rarities[rarity]) {
                rarities[rarity].push(char);
            }
        });

        return rarities;
    }

    /**
     * Creates an adaptive collection display that chooses the best format
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {string} displayMode - 'modern' or 'classic'
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Message options with appropriate display format
     */
    static async createAdaptiveCollection(characters, targetUser, displayMode = 'modern', page = 1, totalPages = 1) {
        if (displayMode === 'modern' && this.supportsModernComponents()) {
            return await this.createModernCollectionEmbed(characters, targetUser, page, totalPages);
        } else {
            return this.createCollectionEmbed(characters, targetUser, page, totalPages);
        }
    }

    /**
     * Checks if modern components are supported
     * @returns {boolean} Whether modern components are supported
     */
    static supportsModernComponents() {
        // For now, assume modern components are supported
        // In production, you might check:
        // - Discord client version
        // - User preferences
        // - Feature flags
        return true;
    }

    /**
     * Creates a character detail view
     * @param {Object} character - Character data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Message options with character details
     */
    static async createCharacterDetailEmbed(character, targetUser) {
        let imageUrl = null;

        // Initialize image manager and load character image
        const imageManager = new CharacterImageManager();
        try {
            const imageResult = await imageManager.loadCharacterImage(character);
            if (imageResult.success && imageResult.url) {
                imageUrl = imageResult.url;
            } else if (character.imageUrl) {
                imageUrl = character.imageUrl;
            }
        } catch (error) {
            console.warn(`Failed to load image for character ${character.name}:`, error.message);
            imageUrl = character.imageUrl || null;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${this.getRarityEmoji(character.rarity)} ${character.name}`)
            .setDescription(character.description || 'A mysterious character from the anime multiverse')
            .setColor(this.getRarityColor(character.rarity))
            .setImage(imageUrl)
            .addFields(
                {
                    name: '📊 **Stats**',
                    value: [
                        `**Level:** ${character.level}`,
                        `**Experience:** ${character.exp || 0}`,
                        `**Rarity:** ${character.rarity}`,
                        `**Anime:** ${character.anime || 'Unknown'}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '⚔️ **Combat Stats**',
                    value: [
                        `**Attack:** ${character.attack || 0}`,
                        `**Defense:** ${character.defense || 0}`,
                        `**Speed:** ${character.speed || 0}`,
                        `**Health:** ${character.health || 100}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '🎯 **Abilities**',
                    value: character.abilities && character.abilities.length > 0
                        ? character.abilities.map(ability => `• ${ability}`).join('\n')
                        : 'No special abilities',
                    inline: false
                }
            )
            .setFooter({ text: `Owned by ${targetUser.username} • Use /collection to return` })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`character_equip_${character.id}_${targetUser.id}`)
                    .setLabel('Equip Character')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('⚔️'),
                new ButtonBuilder()
                    .setCustomId(`character_upgrade_${character.id}_${targetUser.id}`)
                    .setLabel('Upgrade')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⬆️'),
                new ButtonBuilder()
                    .setCustomId(`character_back_${targetUser.id}`)
                    .setLabel('Back to Collection')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⬅️')
            );

        return {
            components: [row],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }

    /**
     * Creates a rarity filter select menu
     * @param {string} userId - User ID
     * @returns {Object} Message options with filter menu
     */
    static createRarityFilter(userId) {
        const embed = new EmbedBuilder()
            .setTitle('🔍 Filter Characters by Rarity')
            .setDescription('Select a rarity to filter your character collection:')
            .setColor(COLORS.INFO);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`collection_filter_select_${userId}`)
            .setPlaceholder('Choose a rarity...')
            .addOptions(
                {
                    label: 'All Characters',
                    description: 'Show all characters in your collection',
                    value: 'all',
                    emoji: '📚'
                },
                {
                    label: 'Dimensional Characters',
                    description: 'Ultra rare dimensional characters',
                    value: 'DIMENSIONAL',
                    emoji: '🌌'
                },
                {
                    label: 'Mythic Characters',
                    description: 'Legendary mythic characters',
                    value: 'MYTHIC',
                    emoji: '💎'
                },
                {
                    label: 'Legendary Characters',
                    description: 'Powerful legendary characters',
                    value: 'LEGENDARY',
                    emoji: '👑'
                },
                {
                    label: 'Epic Characters',
                    description: 'Rare epic characters',
                    value: 'EPIC',
                    emoji: '💜'
                },
                {
                    label: 'Rare Characters',
                    description: 'Uncommon rare characters',
                    value: 'RARE',
                    emoji: '💙'
                },
                {
                    label: 'Common Characters',
                    description: 'Basic common characters',
                    value: 'COMMON',
                    emoji: '💚'
                }
            );

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        return {
            components: [row],
            flags: MessageFlags.IsComponentsV2,
            embeds: []
        };
    }

    /**
     * Creates an adaptive character collection (chooses best format based on display mode)
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {string} displayMode - 'modern' or 'classic'
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Message options with embed and components
     */
    static async createAdaptiveCollection(characters, targetUser, displayMode = 'modern', page = 1, totalPages = 1) {
        if (displayMode === 'modern') {
            return await this.createModernCollectionEmbed(characters, targetUser, page, totalPages);
        } else {
            return this.createCollectionEmbed(characters, targetUser, page, totalPages);
        }
    }

    /**
     * Creates an adaptive character collection (chooses best format based on display mode)
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {string} displayMode - 'modern' or 'classic'
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Message options with embed and components
     */
    static async createAdaptiveCollection(characters, targetUser, displayMode = 'modern', page = 1, totalPages = 1) {
        if (displayMode === 'modern') {
            return await this.createModernCollectionEmbed(characters, targetUser, page, totalPages);
        } else {
            return this.createCollectionEmbed(characters, targetUser, page, totalPages);
        }
    }

    /**
     * Gets emoji for rarity
     * @param {string} rarity - Character rarity
     * @returns {string} Rarity emoji
     */
    static getRarityEmoji(rarity) {
        const emojis = {
            'DIMENSIONAL': '🌌',
            'MYTHIC': '💎',
            'LEGENDARY': '👑',
            'EPIC': '💜',
            'RARE': '💙',
            'COMMON': '💚'
        };
        return emojis[rarity] || '❓';
    }

    /**
     * Gets color for rarity
     * @param {string} rarity - Character rarity
     * @returns {number} Color code
     */
    static getRarityColor(rarity) {
        const colors = {
            'DIMENSIONAL': COLORS.DIMENSIONAL,
            'MYTHIC': COLORS.MYTHIC,
            'LEGENDARY': COLORS.LEGENDARY,
            'EPIC': COLORS.EPIC,
            'RARE': COLORS.RARE,
            'COMMON': COLORS.COMMON
        };
        return colors[rarity] || COLORS.PRIMARY;
    }
}

module.exports = CharacterCollection;
