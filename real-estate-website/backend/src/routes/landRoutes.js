const express = require('express');
const {
  getAvailableLands,
  getLandDetails,
  addLand,
  editLand,
  deleteLand
} = require('../controllers/landController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getAvailableLands);
router.get('/:id', getLandDetails);
router.post('/', authMiddleware, addLand);
router.put('/:id', authMiddleware, editLand);
router.delete('/:id', authMiddleware, deleteLand);

module.exports = router;