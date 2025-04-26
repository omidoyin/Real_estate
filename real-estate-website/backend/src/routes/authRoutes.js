const express = require('express');
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// Forgot password
router.post('/forgot-password', forgotPassword);

module.exports = router;