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

// Public GET routes
router.get('/', goalController.getAllGoals);
router.get('/:goalId', goalController.getGoalById);
router.get('/user/:userId', goalController.getGoalsByUser);

// Protected routes
router.post('/', auth, validate(goalValidation), goalController.createGoal);
router.put('/:goalId', auth, validate(goalValidation), goalController.updateGoal);
router.delete('/:goalId', auth, goalController.deleteGoal);

// Bonus route for updating progress
router.put('/:goalId/progress', auth, 
  validate([body('currentValue').isFloat({ min: 0 })]),
  goalController.updateGoalProgress
);

module.exports = router;