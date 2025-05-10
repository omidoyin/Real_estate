const express = require('express');
const {
  getAllServices,
  getServiceDetails,
  addService,
  editService,
  deleteService,
  getEstateManagementServices,
  getArchitecturalDesignServices,
  getPropertyValuationServices,
  getLegalConsultationServices,
  subscribeToService,
  unsubscribeFromService,
  getUserSubscribedServices
} = require('../controllers/serviceController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { uploadMedia } = require('../utils/cloudinary');

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/estate-management', getEstateManagementServices);
router.get('/architectural-design', getArchitecturalDesignServices);
router.get('/property-valuation', getPropertyValuationServices);
router.get('/legal-consultation', getLegalConsultationServices);
router.get('/:id', getServiceDetails);

// Protected routes - require authentication
router.post('/subscribe/:id', authMiddleware, subscribeToService);
router.delete('/subscribe/:id', authMiddleware, unsubscribeFromService);
router.get('/my-services', authMiddleware, getUserSubscribedServices);

// Admin routes - require admin privileges
router.post('/', authMiddleware, adminMiddleware, uploadMedia, addService);
router.put('/:id', authMiddleware, adminMiddleware, uploadMedia, editService);
router.delete('/:id', authMiddleware, adminMiddleware, deleteService);

module.exports = router;
