const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  mealType: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
  foodItems: { type: String, required: true },
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, min: 0 },
  carbs: { type: Number, min: 0 },
  fats: { type: Number, min: 0 },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meal', mealSchema);