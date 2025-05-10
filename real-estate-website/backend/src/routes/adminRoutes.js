const express = require("express");
const {
  getAdminStats,
  adminLogin,
  getUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getAdminDashboardData,
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getTeams,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getInspections,
  addInspection,
  updateInspection,
  deleteInspection,
} = require("../controllers/adminController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const { uploadMedia } = require("../utils/cloudinary");

const router = express.Router();

// Admin authentication
router.post("/login", adminLogin);

// Admin dashboard
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getAdminDashboardData
);
router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

// User management
router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.get("/users/:userId", authMiddleware, adminMiddleware, getUserDetails);
router.put(
  "/users/:userId/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);
router.delete("/users/:userId", authMiddleware, adminMiddleware, deleteUser);

// Announcement management
router.get("/announcements", authMiddleware, adminMiddleware, getAnnouncements);
router.post("/announcements", authMiddleware, adminMiddleware, addAnnouncement);
router.put(
  "/announcements/:id",
  authMiddleware,
  adminMiddleware,
  updateAnnouncement
);
router.delete(
  "/announcements/:id",
  authMiddleware,
  adminMiddleware,
  deleteAnnouncement
);

// Team management
router.get("/teams", authMiddleware, adminMiddleware, getTeams);
router.post(
  "/teams",
  authMiddleware,
  adminMiddleware,
  uploadMedia,
  addTeamMember
);
router.put(
  "/teams/:id",
  authMiddleware,
  adminMiddleware,
  uploadMedia,
  updateTeamMember
);
router.delete("/teams/:id", authMiddleware, adminMiddleware, deleteTeamMember);

// Inspection management
router.get("/inspections", authMiddleware, adminMiddleware, getInspections);
router.post("/inspections", authMiddleware, adminMiddleware, addInspection);
router.put(
  "/inspections/:id",
  authMiddleware,
  adminMiddleware,
  updateInspection
);
router.delete(
  "/inspections/:id",
  authMiddleware,
  adminMiddleware,
  deleteInspection
);

module.exports = router;
