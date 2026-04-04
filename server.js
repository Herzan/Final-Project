require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');        // ← fixed if db.js is in root
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const swaggerSetup = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);

swaggerSetup(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));