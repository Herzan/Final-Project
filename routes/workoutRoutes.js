const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get all workouts
 *     description: Retrieve a list of all workouts in the system
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
 *         description: The workout ID
 *     responses:
 *       200:
 *         description: Workout found
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
 *     description: Add a new workout (usually linked to a userId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Workout'
 *     responses:
 *       201:
 *         description: Workout created successfully
 *       400:
 *         description: Validation error or bad request
 *       500:
 *         description: Server error
 */
router.post('/', workoutController.createWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   put:
 *     summary: Update a workout
 *     description: Update an existing workout by ID
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
 *             $ref: '#/components/schemas/Workout'
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *       404:
 *         description: Workout not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/:workoutId', workoutController.updateWorkout);

/**
 * @swagger
 * /api/workouts/{workoutId}:
 *   delete:
 *     summary: Delete a workout
 *     description: Remove a workout by ID
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
 *         description: Workout not found
 *       500:
 *         description: Server error
 */
router.delete('/:workoutId', workoutController.deleteWorkout);

/**
 * @swagger
 * /api/workouts/user/{userId}:
 *   get:
 *     summary: Get all workouts for a specific user
 *     description: Retrieve workouts filtered by userId
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
 *     description: Retrieve workouts for a specific date (format YYYY-MM-DD)
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of workouts on that date
 *       500:
 *         description: Server error
 */
router.get('/date/:date', workoutController.getWorkoutsByDate);

module.exports = router;