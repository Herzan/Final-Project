const Meal = require('../models/Meal');

// ====================== CREATE ======================
exports.createMeal = async (req, res) => {
  try {
    const meal = new Meal({ ...req.body, userId: req.user.id });
    await meal.save();
    res.status(201).json({ message: 'Meal created successfully', meal });
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

// ====================== READ ======================
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find().populate('userId', 'name email');
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.mealId)
      .populate('userId', 'name email');

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMealsByUser = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMealsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const meals = await Meal.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userId', 'name email').sort({ date: -1 });

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ====================== UPDATE ======================
exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.mealId, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!meal) {
      return res.status(404).json({ 
        message: 'Meal not found or you are not authorized to update it' 
      });
    }

    res.status(200).json({ message: 'Meal updated successfully', meal });
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

// ====================== DELETE ======================
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.mealId,
      userId: req.user.id
    });

    if (!meal) {
      return res.status(404).json({ 
        message: 'Meal not found or you are not authorized to delete it' 
      });
    }

    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};