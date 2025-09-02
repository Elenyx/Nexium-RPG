const defineUser = require('./User');
// Add other model definitions here as they are created

const initializeModels = (sequelize) => {
    const User = defineUser(sequelize);
    // Initialize other models here

    // Define associations here if needed
    // Example: User.hasMany(OtherModel);

    return {
        User,
        // Other models
    };
};

module.exports = initializeModels;
