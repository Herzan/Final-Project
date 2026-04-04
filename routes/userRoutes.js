const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Example Swagger comments for auto-doc
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
// Add POST register/login, PUT, DELETE...

module.exports = router;