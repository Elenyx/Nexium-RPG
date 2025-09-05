const defineUser = require('./User');
const defineCharacter = require('./Character');
const defineUserCharacter = require('./UserCharacter');
const defineInventory = require('./Inventory');

const initializeModels = (sequelize) => {
    const User = defineUser(sequelize);
    const Character = defineCharacter(sequelize);
    const UserCharacter = defineUserCharacter(sequelize);
    const Inventory = defineInventory(sequelize);

    // Define associations
    User.belongsToMany(Character, {
        through: UserCharacter,
        foreignKey: 'userId',
        otherKey: 'characterId',
        as: 'characters'
    });

    Character.belongsToMany(User, {
        through: UserCharacter,
        foreignKey: 'characterId',
        otherKey: 'userId',
        as: 'owners'
    });

    UserCharacter.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });

    UserCharacter.belongsTo(Character, {
        foreignKey: 'characterId',
        as: 'character'
    });

    // Inventory belongs to User
    if (Inventory && User) {
        Inventory.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }

    return {
        User,
        Character,
        UserCharacter,
        Inventory
    };
};

module.exports = initializeModels;
