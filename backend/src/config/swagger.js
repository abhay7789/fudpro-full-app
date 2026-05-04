const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FudPro API Documentation',
      version: '1.0.0',
      description: 'API Documentation for the FudPro Food Delivery Backend Platform',
    },
    servers: [
      {
        url: 'http://localhost:8090',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing OpenAPI definitions
  apis: [
    './src/loaders/express.loader.js',
    './src/modules/**/*.routes.js'
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
