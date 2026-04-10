require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const mealRoutes = require('./routes/mealRoutes');
const goalRoutes = require('./routes/goalRoutes');
const swaggerSetup = require('./swagger');

// NEW: GitHub OAuth
const githubOAuth = require('./middleware/githubAuth');

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB();

// ====================== GITHUB OAUTH ROUTES (PUBLIC) ======================
app.get('/github/login', githubOAuth.login);
app.get('/github/callback', githubOAuth.callback);

// ====================== API ROUTES ======================
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/goals', goalRoutes);

// Swagger Documentation
swaggerSetup(app);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app; // Export for testing