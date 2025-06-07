const express = require("express");
const {
  getPaymentHistory,
  addPayment,
  updatePayment,
  deletePayment,
  markPaymentCompleted,
  getPaymentDetails,
  getAllPayments,
  getPaymentPlan,
  updatePaymentPlan,
  processPayment,
  getInstallmentDetails,
} = require("../controllers/paymentController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// User routes
router.get("/history", authMiddleware, getPaymentHistory);
router.get("/plan", authMiddleware, getPaymentPlan);
router.get("/installments/:paymentId", authMiddleware, getInstallmentDetails);
router.post("/process", authMiddleware, processPayment);
router.get("/:paymentId", authMiddleware, getPaymentDetails);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, getAllPayments);
router.post("/", authMiddleware, adminMiddleware, addPayment);
router.put("/:paymentId", authMiddleware, adminMiddleware, updatePayment);
router.delete("/:paymentId", authMiddleware, adminMiddleware, deletePayment);
router.patch(
  "/:paymentId/complete",
  authMiddleware,
  adminMiddleware,
  markPaymentCompleted
);
router.put("/plan/:userId", authMiddleware, adminMiddleware, updatePaymentPlan);

module.exports = router;
