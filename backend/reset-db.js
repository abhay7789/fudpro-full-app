/**
 * WARNING: This script drops all tables and re-seeds the database.
 * Use ONLY for initial setup or catastrophic recovery.
 * NOT part of the regular development workflow.
 */
require('./src/config/env');
const { connectDB, sequelize } = require('./src/config/db');
const setupAssociations = require('./src/config/associations');
const runSeeds = require('./src/seeds/index');
const logger = require('./src/shared/utils/logger');

const reset = async () => {
  try {
    await connectDB();
    setupAssociations();
    logger.info('Resetting database...');
    
    // Force sync drops all tables and recreates them
    await sequelize.sync({ force: true });
    logger.info('Database cleaned successfully.');
    
    // Seed basic data
    await runSeeds();
    logger.info('Database re-seeded with Superadmin and Admin credentials.');
    
    process.exit(0);
  } catch (error) {
    logger.error('Reset failed:', error);
    process.exit(1);
  }
};

reset();
