const defineUser = require('./User');
const defineCharacter = require('./Character');
const defineUserCharacter = require('./UserCharacter');

const initializeModels = (sequelize) => {
    const User = defineUser(sequelize);
    const Character = defineCharacter(sequelize);
    const UserCharacter = defineUserCharacter(sequelize);

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

    return {
        User,
        Character,
        UserCharacter
    };
};

module.exports = initializeModels;
