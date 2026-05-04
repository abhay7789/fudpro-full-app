const expressLoader = require('./express.loader');
const routesLoader = require('./routes.loader');
const errorMiddleware = require('../shared/middleware/error.middleware');
const logger = require('../shared/utils/logger');

const initLoaders = (app) => {
  logger.info('Initializing loaders...');

  expressLoader(app);
  logger.info('Express loaded.');

  routesLoader(app);
  logger.info('Routes loaded.');

  // Error middleware MUST be last
  app.use(errorMiddleware);
  logger.info('Error handlers loaded.');

  return app;
};

module.exports = initLoaders;
