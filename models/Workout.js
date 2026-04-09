const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Workout date is required'],
    // Prevent future dates if you want (optional but good practice)
    // validate: {
    //   validator: function(v) {
    //     return v <= new Date();
    //   },
    //   message: 'Workout date cannot be in the future'
    // }
  },
  type: {
    type: String,
    required: [true, 'Workout type is required'],
    trim: true,
    enum: {
      values: ['Cardio', 'Strength', 'HIIT', 'Yoga', 'Mobility', 'Sports', 'Other'],
      message: '{VALUE} is not a valid workout type'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories burned cannot be negative'],
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true   // Automatically adds createdAt and updatedAt
});

// Optional: Compound index for frequent queries (user + date)
workoutSchema.index({ userId: 1, date: -1 });

// Optional: Virtual for easy population display
workoutSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Workout', workoutSchema);