const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitTrack API',
      version: '1.0.0',
      description: 'Fitness tracking API for managing users, workouts, meals, and goals',
    },
    servers: [
      { 
        url: 'https://final-project-27de.onrender.com', 
        description: 'Production (Render)' 
      },
      { 
        url: 'http://localhost:5000', 
        description: 'Local development' 
      },
    ],
    components: {
      schemas: {
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            password: { type: 'string', example: 'StrongPass123!', minLength: 8 }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        WorkoutInput: {
          type: 'object',
          required: ['userId', 'date', 'type', 'duration'],
          properties: {
            userId: { type: 'string', example: '60f7b5c9e4b0a1234567890a' },
            date: { type: 'string', format: 'date', example: '2026-04-03' },
            type: { type: 'string', example: 'Strength' },
            duration: { type: 'integer', minimum: 1, example: 60 },
            caloriesBurned: { type: 'integer', minimum: 0, example: 450 },
            notes: { type: 'string', example: 'Focused on bench press and deadlifts. Felt strong today!' }
          }
        },
        Workout: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            type: { type: 'string' },
            duration: { type: 'integer' },
            caloriesBurned: { type: 'integer' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],   // This reads JSDoc from your route files
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
};