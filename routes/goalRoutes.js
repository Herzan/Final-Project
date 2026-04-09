const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

const goalValidation = [
  body('title')
    .notEmpty().withMessage('Goal title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('targetValue')
    .isFloat({ min: 0 }).withMessage('Target value must be a positive number'),
  body('unit')
    .notEmpty().withMessage('Unit is required')
    .isLength({ max: 20 }).withMessage('Unit cannot exceed 20 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('deadline')
    .optional()
    .isISO8601().withMessage('Invalid deadline date format'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'failed']).withMessage('Invalid status')
];

/**
 * @swagger
 * /api/goals:
 *   get:
 *     summary: Get all goals
 *     description: Retrieve a list of all goals (populated with user info)
 *     responses:
 *       200:
 *         description: List of goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *       500:
 *         description: Server error
 */
router.get('/', goalController.getAllGoals);

/**
 * @swagger
 * /api/goals:
 *   post:
 *     summary: Create a new goal
 *     security:
 *       - bearerAuth: []
 *     description: Create a new goal for the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalInput'
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', auth, validate(goalValidation), goalController.createGoal);

/**
 * @swagger
 * /api/goals/{goalId}:
 *   get:
 *     summary: Get goal by ID
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal found
 *       404:
 *         description: Goal not found
 *       500:
 *         description: Server error
 */
router.get('/:goalId', goalController.getGoalById);

/**
 * @swagger
 * /api/goals/{goalId}:
 *   put:
 *     summary: Update a goal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalInput'
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found or not authorized
 *       500:
 *         description: Server error
 */
router.put('/:goalId', auth, validate(goalValidation), goalController.updateGoal);

/**
 * @swagger
 * /api/goals/{goalId}:
 *   delete:
 *     summary: Delete a goal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found or not authorized
 *       500:
 *         description: Server error
 */
router.delete('/:goalId', auth, goalController.deleteGoal);

/**
 * @swagger
 * /api/goals/user/{userId}:
 *   get:
 *     summary: Get goals by user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's goals
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', goalController.getGoalsByUser);

/**
 * @swagger
 * /api/goals/{goalId}/progress:
 *   put:
 *     summary: Update goal progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: goalId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentValue:
 *                 type: number
 *     responses:
 *       200:
 *         description: Goal progress updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Goal not found
 */
router.put('/:goalId/progress', auth, 
  validate([body('currentValue').isFloat({ min: 0 })]),
  goalController.updateGoalProgress
);

module.exports = router;