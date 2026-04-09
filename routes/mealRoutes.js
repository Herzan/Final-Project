const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

const mealValidation = [
  body('date').isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)').toDate(),
  body('mealType')
    .notEmpty().withMessage('Meal type is required')
    .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack'])
    .withMessage('Invalid meal type'),
  body('foodItems')
    .notEmpty().withMessage('Food items description is required')
    .isLength({ max: 500 }).withMessage('Food items cannot exceed 500 characters'),
  body('calories')
    .isInt({ min: 0 }).withMessage('Calories must be a non-negative integer'),
  body('protein').optional().isFloat({ min: 0 }),
  body('carbs').optional().isFloat({ min: 0 }),
  body('fats').optional().isFloat({ min: 0 }),
  body('notes').optional().isLength({ max: 300 }).withMessage('Notes cannot exceed 300 characters')
];

// Public GET routes
router.get('/', mealController.getAllMeals);
router.get('/user/:userId', mealController.getMealsByUser);
router.get('/date/:date', mealController.getMealsByDate);
router.get('/:mealId', mealController.getMealById);

// Protected routes (POST, PUT, DELETE)
router.post('/', auth, validate(mealValidation), mealController.createMeal);
router.put('/:mealId', auth, validate(mealValidation), mealController.updateMeal);
router.delete('/:mealId', auth, mealController.deleteMeal);

module.exports = router;