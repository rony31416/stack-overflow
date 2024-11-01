// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD routes
router.post('/users', userController.createUser);         // Create user
router.get('/users/:id', userController.getUserById);     // Get user by ID
router.put('/users/:id', userController.updateUser);      // Update user by ID
router.delete('/users/:id', userController.deleteUser);   // Delete user by ID
router.get('/users', userController.getAllUsers);         // Get all users

module.exports = router;
