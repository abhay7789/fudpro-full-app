const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const { xss } = require('express-xss-sanitizer');
const metricsMiddleware = require('../shared/middleware/metrics.middleware');
const idempotencyMiddleware = require('../shared/middleware/idempotency.middleware');
const errorMiddleware = require('../shared/middleware/error.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../config/swagger');


const expressLoader = (app) => {
  // Security Middlewares
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(xss());
  app.use(hpp());

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
  });
  app.use('/api/', limiter);

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Custom Middlewares
  app.use(metricsMiddleware);
  app.use(idempotencyMiddleware);

  // Serve static files from uploads
  app.use('/uploads', express.static('uploads'));

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @openapi
   * /health:
   *   get:
   *     tags:
   *       - System
   *     summary: Check API Health
   *     description: Returns the health status of the API server
   *     responses:
   *       200:
   *         description: API is UP and running
   */
  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
  });

  return app;
};

module.exports = expressLoader;
