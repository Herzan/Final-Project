const Workout = require('../models/Workout');

exports.getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find()
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId)
      .populate('userId', 'name email');
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    // Attach authenticated user ID for security
    const newWorkout = new Workout({
      ...req.body,
      userId: req.user.id
    });
    
    await newWorkout.save();
    res.status(201).json({ 
      message: 'Workout created successfully', 
      workout: newWorkout 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation error', 
      error: error.message 
    });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    // Ensure the workout belongs to the authenticated user (ownership check)
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.workoutId, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!workout) {
      return res.status(404).json({ 
        message: 'Workout not found or you are not authorized to update it' 
      });
    }

    res.status(200).json({ 
      message: 'Workout updated successfully', 
      workout 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Validation error', 
      error: error.message 
    });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.workoutId,
      userId: req.user.id
    });

    if (!workout) {
      return res.status(404).json({ 
        message: 'Workout not found or you are not authorized to delete it' 
      });
    }

    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.getWorkoutsByUser = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId })
      .populate('userId', 'name email')
      .sort({ date: -1 });
    
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWorkoutsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const workouts = await Workout.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userId', 'name email').sort({ date: -1 });

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};