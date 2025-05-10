const express = require('express');
const {
  getAvailableHouses,
  getHouseDetails,
  addHouse,
  editHouse,
  deleteHouse,
  addHouseToFavorites,
  removeHouseFromFavorites,
  getUserFavoriteHouses,
  getUserPurchasedHouses,
  searchHouses,
  filterHouses
} = require('../controllers/houseController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { uploadMedia } = require('../utils/cloudinary');

const router = express.Router();

// Public routes
router.get('/', getAvailableHouses);
router.get('/search', searchHouses);
router.get('/filter', filterHouses);
router.get('/:id', getHouseDetails);

// Protected routes - require authentication
router.get('/favorites', authMiddleware, getUserFavoriteHouses);
router.post('/favorites/:id', authMiddleware, addHouseToFavorites);
router.delete('/favorites/:id', authMiddleware, removeHouseFromFavorites);
router.get('/my-houses', authMiddleware, getUserPurchasedHouses);

// Admin routes - require admin privileges
router.post('/', authMiddleware, adminMiddleware, uploadMedia, addHouse);
router.put('/:id', authMiddleware, adminMiddleware, uploadMedia, editHouse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteHouse);

module.exports = router;
