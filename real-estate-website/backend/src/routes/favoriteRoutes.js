const express = require('express');
const {
  getUserFavorites,
  getFavoritesByType,
  addToFavorites,
  removeFromFavorites
} = require('../controllers/favoriteController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get all user favorites (lands, houses, apartments)
router.get('/', authMiddleware, getUserFavorites);

// Get favorites by type
router.get('/lands', authMiddleware, (req, res) => getFavoritesByType(req, res, 'Land'));
router.get('/houses', authMiddleware, (req, res) => getFavoritesByType(req, res, 'House'));
router.get('/apartments', authMiddleware, (req, res) => getFavoritesByType(req, res, 'Apartment'));

// Add to favorites
router.post('/', authMiddleware, addToFavorites);

// Remove from favorites
router.delete('/:favoriteId', authMiddleware, removeFromFavorites);

module.exports = router;
