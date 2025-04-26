const express = require('express');
const { getPaymentHistory, addPayment, markPaymentCompleted } = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to get payment history for a user
router.get('/history', authenticate, getPaymentHistory);

// Route to add a new payment
router.post('/', authenticate, addPayment);

// Route to mark a payment as completed
router.patch('/:paymentId/complete', authenticate, markPaymentCompleted);

module.exports = router;