const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

const workoutValidation = [
  body('date')
    .isISO8601()
    .withMessage('Invalid date format (use YYYY-MM-DD)')
    .toDate(),
  body('type')
    .notEmpty().withMessage('Workout type is required')
    .isIn(['Cardio', 'Strength', 'HIIT', 'Yoga', 'Mobility', 'Sports', 'Other'])
    .withMessage('Invalid workout type'),
  body('duration')
    .isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('caloriesBurned')
    .optional()
    .isInt({ min: 0 }).withMessage('Calories burned cannot be negative'),
  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workouts
 *     description: Retrieve a list of all workouts in the system (populated with user info)
 *     responses:
 *       200:
 *         description: List of workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *       500:
 *         description: Server error
 */
router.get('/', workoutController.getAllWorkouts);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   get:
 *     summary: Get a single workout by ID
 *     description: Retrieve one workout using its MongoDB ID
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Workout found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Server error
 */
router.get('/:workoutId', workoutController.getWorkoutById);

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout
 *     description: Add a new workout linked to the authenticated user (requires JWT)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutInput'
 *     responses:
 *       201:
 *         description: Workout created successfully
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Server error
 */
router.post('/', auth, validate(workoutValidation), workoutController.createWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   put:
 *     summary: Update a workout
 *     description: Update an existing workout by ID (only owner can update)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutInput'
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Workout not found or not authorized
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:workoutId', auth, validate(workoutValidation), workoutController.updateWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   delete:
 *     summary: Delete a workout
 *     description: Remove a workout by ID (only owner can delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *       404:
 *         description: Workout not found or not authorized
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:workoutId', auth, workoutController.deleteWorkout);

/**
 * @swagger
 * /api/workouts/user/{userId}:
 *   get:
 *     summary: Get all workouts for a specific user
 *     description: Retrieve all workouts filtered by userId
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's workouts
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', workoutController.getWorkoutsByUser);

/**
 * @swagger
 * /api/workouts/date/{date}:
 *   get:
 *     summary: Get workouts by date
 *     description: Retrieve workouts for a specific date (format: YYYY-MM-DD)
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-04-03"
 *     responses:
 *       200:
 *         description: List of workouts on that date
 *       500:
 *         description: Server error
 */
router.get('/date/:date', workoutController.getWorkoutsByDate);

module.exports = router;