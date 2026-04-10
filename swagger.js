const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitTrack API',
      version: '1.0.0',
      description: 'Fitness tracking API for managing users, workouts, meals, and goals with JWT authentication',
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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token from /api/users/login (without "Bearer " prefix)'
        }
      },
      schemas: {
        // ====================== USER ======================
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

        // ====================== AUTH ======================
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            password: { type: 'string', example: 'StrongPass123!' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful' },
            token: { 
              type: 'string', 
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
            },
            user: { 
              $ref: '#/components/schemas/User' 
            }
          }
        },

        // ====================== WORKOUT ======================
        WorkoutInput: {
          type: 'object',
          required: ['date', 'type', 'duration'],
          properties: {
            date: { type: 'string', format: 'date', example: '2026-04-03' },
            type: { 
              type: 'string', 
              enum: ['Cardio', 'Strength', 'HIIT', 'Yoga', 'Mobility', 'Sports', 'Other'],
              example: 'Strength' 
            },
            duration: { type: 'integer', minimum: 1, example: 60 },
            caloriesBurned: { type: 'integer', minimum: 0, example: 450 },
            notes: { type: 'string', maxLength: 500, example: 'Focused on bench press and deadlifts. Felt strong today!' }
          }
        },
        Workout: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string', example: '60f7b5c9e4b0a1234567890a' },
            date: { type: 'string', format: 'date' },
            type: { type: 'string' },
            duration: { type: 'integer' },
            caloriesBurned: { type: 'integer' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // ====================== MEAL ======================
        MealInput: {
          type: 'object',
          required: ['date', 'mealType', 'foodItems', 'calories'],
          properties: {
            date: { type: 'string', format: 'date', example: '2026-04-03' },
            mealType: { 
              type: 'string', 
              enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
              example: 'Lunch' 
            },
            foodItems: { type: 'string', example: 'Grilled chicken, rice, broccoli' },
            calories: { type: 'integer', minimum: 0, example: 650 },
            protein: { type: 'number', minimum: 0, example: 45 },
            carbs: { type: 'number', minimum: 0, example: 70 },
            fats: { type: 'number', minimum: 0, example: 20 },
            notes: { type: 'string', maxLength: 300, example: 'High protein meal' }
          }
        },
        Meal: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            mealType: { type: 'string' },
            foodItems: { type: 'string' },
            calories: { type: 'integer' },
            protein: { type: 'number' },
            carbs: { type: 'number' },
            fats: { type: 'number' },
            notes: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },

        // ====================== GOAL ======================
        GoalInput: {
          type: 'object',
          required: ['title', 'targetValue', 'unit'],
          properties: {
            title: { type: 'string', example: 'Lose 10kg' },
            description: { type: 'string', example: 'Reach my target weight by summer' },
            targetValue: { type: 'number', minimum: 0, example: 10 },
            unit: { type: 'string', example: 'kg' },
            deadline: { type: 'string', format: 'date', example: '2026-07-01' },
            currentValue: { type: 'number', minimum: 0, default: 0, example: 3 }
          }
        },
        Goal: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            targetValue: { type: 'number' },
            currentValue: { type: 'number' },
            unit: { type: 'string' },
            deadline: { type: 'string', format: 'date' },
            status: { 
              type: 'string', 
              enum: ['active', 'completed', 'failed'],
              example: 'active' 
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']   // Reads JSDoc comments from your route files
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { 
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true
    }
  }));
};