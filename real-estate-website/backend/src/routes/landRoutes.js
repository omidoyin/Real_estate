const express = require("express");
const {
  getAvailableLands,
  getLandDetails,
  addLand,
  editLand,
  deleteLand,
  addLandToFavorites,
  removeLandFromFavorites,
  getUserFavoriteLands,
  getUserPurchasedLands,
  searchLands,
  filterLands,
} = require("../controllers/landController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const { uploadMedia } = require("../utils/cloudinary");

const router = express.Router();

// Public routes
router.get("/", getAvailableLands);
router.get("/search", searchLands);
router.get("/filter", filterLands);
router.get("/:id", getLandDetails);

// Protected routes - require authentication
router.get("/favorites", authMiddleware, getUserFavoriteLands);
router.post("/favorites/:id", authMiddleware, addLandToFavorites);
router.delete("/favorites/:id", authMiddleware, removeLandFromFavorites);
router.get("/my-lands", authMiddleware, getUserPurchasedLands);

// Admin routes - require admin privileges
router.post("/", authMiddleware, adminMiddleware, uploadMedia, addLand);
router.put("/:id", authMiddleware, adminMiddleware, uploadMedia, editLand);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLand);

module.exports = router;
