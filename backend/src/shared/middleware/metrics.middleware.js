const logger = require('../utils/logger');

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
    
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - Latency: ${timeInMs}ms`);
  });

  next();
};

module.exports = metricsMiddleware;
