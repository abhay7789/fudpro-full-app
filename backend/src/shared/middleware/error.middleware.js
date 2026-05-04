const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status === 500) {
    logger.error(`[500 ERROR] ${req.method} ${req.url}:`, err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

module.exports = errorMiddleware;
