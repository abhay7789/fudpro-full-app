require('./src/config/env'); // Load environment variables first
const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const setupAssociations = require('./src/config/associations');
const logger = require('./src/shared/utils/logger');
const config = require('./src/config/env');

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Setup Associations
    setupAssociations();
    logger.info('Model associations established.');

    const { sequelize } = require('./src/config/db');

    // Pre-sync Cleanup: Drop problematic indexes if they exist
    try {
      await sequelize.query('DROP INDEX IF EXISTS "idx_addresses_userId"');
      await sequelize.query('DROP INDEX IF EXISTS "idx_orders_userId"');
      await sequelize.query('DROP INDEX IF EXISTS "idx_orders_vendorId"');
      await sequelize.query('DROP INDEX IF EXISTS "idx_menu_items_vendorId"');
      await sequelize.query('DROP INDEX IF EXISTS "idx_menu_items_categoryId"');
    } catch (e) {
      logger.warn('Index cleanup warning:', e.message);
    }

    // 3. Sync DB with alter to safely update schema
    await sequelize.sync({ alter: true });
    logger.info('Database schema synchronized with alter: true');
    
    const runSeeds = require('./src/seeds/index');
    await runSeeds();

    // 2. Start Express Server
    const port = config.port || 8090;
    app.listen(port, () => {
      logger.info(`Server is running in ${config.nodeEnv} mode on port ${port}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
