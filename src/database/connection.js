const { Sequelize, Op } = require('sequelize');
const logger = require('../utils/logger');
const initializeModels = require('./models');

let sequelize;
let models;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        }
    });

    // Initialize models with sequelize instance
    models = initializeModels(sequelize);
    // Add Sequelize, Op, and sequelize instance to models for easy access
    models.Sequelize = Sequelize;
    models.Op = Op;
    models.sequelize = sequelize;
} else {
    logger.warn('DATABASE_URL not found. Database features will be disabled.');
    sequelize = null;
    models = null;
}

const connectDatabase = async () => {
    if (!sequelize) {
        logger.info('Skipping database connection - no DATABASE_URL provided');
        return;
    }

    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        logger.info('Database connection established');
    } catch (error) {
        logger.error('Unable to connect to database:', error);
        throw error;
    }
};

module.exports = { sequelize, connectDatabase, models };
