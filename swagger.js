const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitTrack API',
      version: '1.0.0',
      description: 'Fitness tracking API for workouts, meals, and goals',
    },
    servers: [
      { url: 'http://localhost:5000' }, // Update for production
    ],
  },
  apis: ['./routes/*.js'], // Path to files with Swagger comments
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};