const express = require("express");
const router = express.Router();

// Mock controller function for admin stats
router.get("/stats", async (req, res) => {
  try {
    // Replace with actual database queries
    const stats = {
      totalUsers: 100, // Example data
      totalLands: 50, // Example data
      totalPayments: 200, // Example data
    };
    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

module.exports = router;
