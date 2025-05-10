const express = require('express');
const {
  getAvailableApartments,
  getApartmentDetails,
  addApartment,
  editApartment,
  deleteApartment,
  addApartmentToFavorites,
  removeApartmentFromFavorites,
  getUserFavoriteApartments,
  getUserPurchasedApartments,
  searchApartments,
  filterApartments
} = require('../controllers/apartmentController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { uploadMedia } = require('../utils/cloudinary');

const router = express.Router();

// Public routes
router.get('/', getAvailableApartments);
router.get('/search', searchApartments);
router.get('/filter', filterApartments);
router.get('/:id', getApartmentDetails);

// Protected routes - require authentication
router.get('/favorites', authMiddleware, getUserFavoriteApartments);
router.post('/favorites/:id', authMiddleware, addApartmentToFavorites);
router.delete('/favorites/:id', authMiddleware, removeApartmentFromFavorites);
router.get('/my-apartments', authMiddleware, getUserPurchasedApartments);

// Admin routes - require admin privileges
router.post('/', authMiddleware, adminMiddleware, uploadMedia, addApartment);
router.put('/:id', authMiddleware, adminMiddleware, uploadMedia, editApartment);
router.delete('/:id', authMiddleware, adminMiddleware, deleteApartment);

module.exports = router;
