const Goal = require('../models/Goal');

exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId)
      .populate('userId', 'name email');
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const newGoal = new Goal({
      ...req.body,
      userId: req.user.id
    });
    
    await newGoal.save();
    res.status(201).json({ 
      message: 'Goal created successfully', 
      goal: newGoal 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation error', 
      error: error.message 
    });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.goalId, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!goal) {
      return res.status(404).json({ 
        message: 'Goal not found or you are not authorized to update it' 
      });
    }

    res.status(200).json({ 
      message: 'Goal updated successfully', 
      goal 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation error', 
      error: error.message 
    });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.goalId,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ 
        message: 'Goal not found or you are not authorized to delete it' 
      });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getGoalsByUser = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bonus: Update progress on a goal
exports.updateGoalProgress = async (req, res) => {
  try {
    const { currentValue } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.goalId, userId: req.user.id },
      { currentValue },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!goal) {
      return res.status(404).json({ 
        message: 'Goal not found or you are not authorized' 
      });
    }

    // Optional: Auto-update status
    if (goal.currentValue >= goal.targetValue) {
      goal.status = 'completed';
      await goal.save();
    }

    res.status(200).json({ 
      message: 'Goal progress updated', 
      goal 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation error', 
      error: error.message 
    });
  }
};