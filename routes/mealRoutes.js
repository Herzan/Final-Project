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

/**
 * @swagger
 * /api/meals:
 *   get:
 *     summary: Get all meals
 *     description: Retrieve a list of all meals (populated with user info)
 *     responses:
 *       200:
 *         description: List of meals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 *       500:
 *         description: Server error
 */
router.get('/', mealController.getAllMeals);

/**
 * @swagger
 * /api/meals:
 *   post:
 *     summary: Create a new meal
 *     security:
 *       - bearerAuth: []
 *     description: Add a new meal linked to the authenticated user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealInput'
 *     responses:
 *       201:
 *         description: Meal created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', auth, validate(mealValidation), mealController.createMeal);

/**
 * @swagger
 * /api/meals/{mealId}:
 *   get:
 *     summary: Get meal by ID
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meal found
 *       404:
 *         description: Meal not found
 *       500:
 *         description: Server error
 */
router.get('/:mealId', mealController.getMealById);

/**
 * @swagger
 * /api/meals/{mealId}:
 *   put:
 *     summary: Update a meal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealInput'
 *     responses:
 *       200:
 *         description: Meal updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found or not authorized
 *       500:
 *         description: Server error
 */
router.put('/:mealId', auth, validate(mealValidation), mealController.updateMeal);

/**
 * @swagger
 * /api/meals/{mealId}:
 *   delete:
 *     summary: Delete a meal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meal deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found or not authorized
 *       500:
 *         description: Server error
 */
router.delete('/:mealId', auth, mealController.deleteMeal);

/**
 * @swagger
 * /api/meals/user/{userId}:
 *   get:
 *     summary: Get meals by user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's meals
 *       500:
 *         description: Server error
 */
router.get('/user/:userId', mealController.getMealsByUser);

/**
 * @swagger
 * /api/meals/date/{date}:
 *   get:
 *     summary: Get meals by date
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of meals on that date
 *       500:
 *         description: Server error
 */
router.get('/date/:date', mealController.getMealsByDate);

module.exports = router;