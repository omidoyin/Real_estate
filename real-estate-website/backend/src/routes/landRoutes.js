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
  getCloudinarySignature,
} = require("../controllers/landController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAvailableLands);
router.get("/search", searchLands);
router.get("/filter", filterLands);

// Protected routes - require authentication
router.get("/favorites", authMiddleware, getUserFavoriteLands);
router.get("/my-lands", authMiddleware, getUserPurchasedLands);

// Admin routes - require admin privileges
router.get(
  "/cloudinary-signature",
  authMiddleware,
  adminMiddleware,
  getCloudinarySignature
);
router.post("/", authMiddleware, adminMiddleware, addLand);

// Routes with ID parameters (must come after specific routes)
router.get("/:id", getLandDetails);
router.post("/favorites/:id", authMiddleware, addLandToFavorites);
router.delete("/favorites/:id", authMiddleware, removeLandFromFavorites);
router.put("/:id", authMiddleware, adminMiddleware, editLand);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLand);

module.exports = router;
