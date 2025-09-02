/**
 * @file Component Registry
 * @description Central registry for all Discord Components V2 builders
 * @author Nexium Bot Development Team
 */

const ProfileDisplay = require('./builders/ProfileDisplay');
const CharacterCollection = require('./builders/CharacterCollection');
const ShopDisplay = require('./builders/ShopDisplay');
const BattleDisplay = require('./builders/BattleDisplay');

class ComponentRegistry {
    constructor() {
        this.builders = {
            profile: ProfileDisplay,
            collection: CharacterCollection,
            shop: ShopDisplay,
            battle: BattleDisplay
        };
    }

    /**
     * Gets a component builder by name
     * @param {string} name - Builder name
     * @returns {Object} Component builder class
     */
    getBuilder(name) {
        return this.builders[name];
    }

    /**
     * Registers a new component builder
     * @param {string} name - Builder name
     * @param {Object} builder - Builder class
     */
    registerBuilder(name, builder) {
        this.builders[name] = builder;
    }

    /**
     * Gets all available builders
     * @returns {Object} All registered builders
     */
    getAllBuilders() {
        return this.builders;
    }

    /**
     * Creates a profile display
     * @param {Object} userData - User profile data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Profile embed options
     */
    createProfile(userData, targetUser) {
        return ProfileDisplay.createProfileEmbed(userData, targetUser);
    }

    /**
     * Creates detailed profile stats
     * @param {Object} userData - User profile data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Detailed stats embed options
     */
    createDetailedStats(userData, targetUser) {
        return ProfileDisplay.createDetailedStatsEmbed(userData, targetUser);
    }

    /**
     * Creates a character collection display
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Collection embed options
     */
    createCollection(characters, targetUser, page = 1, totalPages = 1) {
        return CharacterCollection.createCollectionEmbed(characters, targetUser, page, totalPages);
    }

    /**
     * Creates a modern character collection display
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Modern collection embed options
     */
    createModernCollection(characters, targetUser, page = 1, totalPages = 1) {
        return CharacterCollection.createModernCollectionEmbed(characters, targetUser, page, totalPages);
    }

    /**
     * Creates an adaptive character collection (chooses best format)
     * @param {Array} characters - Array of user's characters
     * @param {Object} targetUser - Discord user object
     * @param {string} displayMode - 'modern' or 'classic'
     * @param {number} page - Current page number
     * @param {number} totalPages - Total number of pages
     * @returns {Object} Adaptive collection display options
     */
    createAdaptiveCollection(characters, targetUser, displayMode = 'modern', page = 1, totalPages = 1) {
        return CharacterCollection.createAdaptiveCollection(characters, targetUser, displayMode, page, totalPages);
    }

    /**
     * Creates a rarity filter menu
     * @param {string} userId - User ID
     * @returns {Object} Filter menu options
     */
    createRarityFilter(userId) {
        return CharacterCollection.createRarityFilter(userId);
    }

    /**
     * Creates the main shop interface
     * @param {Array} categories - Available shop categories
     * @param {Object} userData - User data for balance display
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Shop interface options
     */
    createShopInterface(categories, userData, targetUser) {
        return ShopDisplay.createShopInterface(categories, userData, targetUser);
    }

    /**
     * Creates a category-specific shop display
     * @param {string} categoryId - Shop category ID
     * @param {Array} items - Items in the category
     * @param {Object} userData - User data
     * @param {Object} targetUser - Discord user object
     * @param {number} page - Current page
     * @returns {Object} Category display options
     */
    createShopCategory(categoryId, items, userData, targetUser, page = 1) {
        return ShopDisplay.createCategoryDisplay(categoryId, items, userData, targetUser, page);
    }

    /**
     * Creates a purchase confirmation
     * @param {Object} item - Item to purchase
     * @param {Object} userData - User data
     * @param {string} userId - User ID
     * @returns {Object} Purchase confirmation options
     */
    createPurchaseConfirmation(item, userData, userId) {
        return ShopDisplay.createPurchaseModal(item, userData, userId);
    }

    /**
     * Creates a purchase success message
     * @param {Object} item - Purchased item
     * @param {Object} userData - Updated user data
     * @param {Object} targetUser - Discord user object
     * @returns {Object} Success message options
     */
    createPurchaseSuccess(item, userData, targetUser) {
        return ShopDisplay.createPurchaseSuccess(item, userData, targetUser);
    }

    /**
     * Creates a battle interface
     * @param {Object} battle - Battle data
     * @param {Object} player - Player character data
     * @param {Object} opponent - Opponent character data
     * @returns {Object} Battle interface options
     */
    createBattleInterface(battle, player, opponent) {
        return BattleDisplay.createBattleInterface(battle, player, opponent);
    }

    /**
     * Creates a battle result summary
     * @param {Object} battle - Completed battle data
     * @param {Object} player - Player data
     * @param {Object} opponent - Opponent data
     * @returns {Object} Battle result options
     */
    createBattleResult(battle, player, opponent) {
        return BattleDisplay.createBattleResult(battle, player, opponent);
    }

    /**
     * Creates an action selection interface
     * @param {Object} character - Character data with abilities
     * @param {string} battleId - Battle ID
     * @returns {Object} Action selection options
     */
    createActionSelection(character, battleId) {
        return BattleDisplay.createActionSelection(character, battleId);
    }

    /**
     * Creates an item selection interface for battle
     * @param {Array} items - Available battle items
     * @param {string} battleId - Battle ID
     * @returns {Object} Item selection options
     */
    createBattleItemSelection(items, battleId) {
        return BattleDisplay.createItemSelection(items, battleId);
    }

    /**
     * Gets default shop categories
     * @returns {Array} Default shop categories
     */
    getDefaultShopCategories() {
        return [
            {
                id: 'consumables',
                name: 'Consumables',
                description: 'Potions, food, and temporary boosts',
                emoji: '🧪'
            },
            {
                id: 'equipment',
                name: 'Equipment',
                description: 'Weapons, armor, and accessories',
                emoji: '⚔️'
            },
            {
                id: 'boosters',
                name: 'Boosters',
                description: 'XP multipliers and stat enhancers',
                emoji: '⚡'
            },
            {
                id: 'cosmetics',
                name: 'Cosmetics',
                description: 'Titles, frames, and visual effects',
                emoji: '🎨'
            }
        ];
    }

    /**
     * Gets sample shop items for testing
     * @param {string} categoryId - Category ID
     * @returns {Array} Sample items for the category
     */
    getSampleShopItems(categoryId) {
        const sampleItems = {
            consumables: [
                {
                    id: 'health_potion',
                    name: 'Health Potion',
                    description: 'Restores 50 HP instantly',
                    effect: 'Restores 50 HP',
                    price: 100,
                    emoji: '❤️'
                },
                {
                    id: 'energy_drink',
                    name: 'Energy Drink',
                    description: 'Restores 25 energy instantly',
                    effect: 'Restores 25 energy',
                    price: 75,
                    emoji: '⚡'
                }
            ],
            equipment: [
                {
                    id: 'wooden_sword',
                    name: 'Wooden Sword',
                    description: 'A basic training sword',
                    effect: '+5 Attack',
                    price: 250,
                    emoji: '⚔️'
                },
                {
                    id: 'leather_armor',
                    name: 'Leather Armor',
                    description: 'Basic protection for beginners',
                    effect: '+3 Defense',
                    price: 300,
                    emoji: '🛡️'
                }
            ],
            boosters: [
                {
                    id: 'xp_booster',
                    name: 'XP Booster',
                    description: 'Doubles XP gain for 1 hour',
                    effect: '2x XP for 1 hour',
                    price: 500,
                    emoji: '⬆️'
                }
            ],
            cosmetics: [
                {
                    id: 'golden_frame',
                    name: 'Golden Frame',
                    description: 'Fancy golden border for your profile',
                    effect: 'Golden profile frame',
                    price: 1000,
                    emoji: '👑'
                }
            ]
        };

        return sampleItems[categoryId] || [];
    }
}

module.exports = ComponentRegistry;
