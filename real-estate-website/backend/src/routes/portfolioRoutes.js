const express = require('express');
const {
  getUserPortfolio,
  getPortfolioByType,
  getPortfolioStats
} = require('../controllers/portfolioController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all user portfolio items (lands, houses, apartments, services)
router.get('/', authMiddleware, getUserPortfolio);

// Get portfolio items by type
router.get('/lands', authMiddleware, (req, res) => getPortfolioByType(req, res, 'Land'));
router.get('/houses', authMiddleware, (req, res) => getPortfolioByType(req, res, 'House'));
router.get('/apartments', authMiddleware, (req, res) => getPortfolioByType(req, res, 'Apartment'));
router.get('/services', authMiddleware, (req, res) => getPortfolioByType(req, res, 'Service'));

// Get portfolio statistics
router.get('/stats', authMiddleware, getPortfolioStats);

module.exports = router;
