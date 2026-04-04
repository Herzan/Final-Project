const Workout = require('../models/Workout');

exports.getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().populate('userId', 'name email');
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.workoutId).populate('userId', 'name email');
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.status(201).json({ message: 'Workout created', workout: newWorkout });
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.workoutId, req.body, { new: true });
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.status(200).json({ message: 'Workout updated', workout });
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.workoutId);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWorkoutsByUser = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).populate('userId', 'name email');
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWorkoutsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const workouts = await Workout.find({ date: { $gte: date, $lt: new Date(date.getTime() + 24*60*60*1000) } });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};