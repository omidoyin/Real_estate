const Payment = require("../models/Payment");
const User = require("../models/User");
const Land = require("../models/Land");
const House = require("../models/House");
const Apartment = require("../models/Apartment");
const Service = require("../models/Service");

/**
 * Get payment history for a user
 * @route GET /api/payments/history
 * @access Private
 */
const getPaymentHistory = async (req, res) => {
  const userId = req.user._id;

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get payments for the user
    const payments = await Payment.find({ userId })
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "propertyId",
        select: "title location price",
      });

    const total = await Payment.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment history",
      error: error.message,
    });
  }
};

/**
 * Get payment details
 * @route GET /api/payments/:paymentId
 * @access Private
 */
const getPaymentDetails = async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user._id;

  try {
    // Find payment and populate property details
    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
    }).populate({
      path: "propertyId",
      select: "title location price images description",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment details",
      error: error.message,
    });
  }
};

/**
 * Get all payments (admin only)
 * @route GET /api/payments
 * @access Private/Admin
 */
const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get all payments
    const payments = await Payment.find()
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "propertyId",
        select: "title location price",
      });

    const total = await Payment.countDocuments();

    res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all payments",
      error: error.message,
    });
  }
};

/**
 * Add a new payment (admin only)
 * @route POST /api/payments
 * @access Private/Admin
 */
const addPayment = async (req, res) => {
  try {
    const {
      userId,
      amount,
      method,
      propertyType,
      propertyId,
      paymentPlan,
      installmentDetails,
    } = req.body;

    // Validate property type
    if (!["Land", "House", "Apartment", "Service"].includes(propertyType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property type",
      });
    }

    // Check if property exists
    let model, userField;

    switch (propertyType) {
      case "Land":
        model = Land;
        userField = "purchasedLands";
        break;
      case "House":
        model = House;
        userField = "purchasedHouses";
        break;
      case "Apartment":
        model = Apartment;
        userField = "purchasedApartments";
        break;
      case "Service":
        model = Service;
        userField = "subscribedServices";
        break;
    }

    const property = await model.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Create new payment
    const newPayment = new Payment({
      userId,
      amount,
      method,
      propertyType,
      propertyId,
      status: "Pending",
      paymentDate: new Date(),
      paymentPlan: paymentPlan || "Full Payment",
      installmentDetails,
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      data: newPayment,
      message: "Payment added successfully",
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding payment",
      error: error.message,
    });
  }
};

/**
 * Mark a payment as completed
 * @route PATCH /api/payments/:paymentId/complete
 * @access Private/Admin
 */
const markPaymentCompleted = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Find the payment
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Update payment status
    payment.status = "Completed";
    await payment.save();

    // If it's a property purchase and full payment, update property status
    if (
      payment.propertyType !== "Service" &&
      payment.paymentPlan === "Full Payment"
    ) {
      let model;

      switch (payment.propertyType) {
        case "Land":
          model = Land;
          break;
        case "House":
          model = House;
          break;
        case "Apartment":
          model = Apartment;
          break;
      }

      await model.findByIdAndUpdate(payment.propertyId, {
        status: "Sold",
        owner: payment.userId,
        purchaseDate: new Date(),
      });
    }

    // Add property to user's purchased properties
    let userField;

    switch (payment.propertyType) {
      case "Land":
        userField = "purchasedLands";
        break;
      case "House":
        userField = "purchasedHouses";
        break;
      case "Apartment":
        userField = "purchasedApartments";
        break;
      case "Service":
        userField = "subscribedServices";
        break;
    }

    await User.findByIdAndUpdate(payment.userId, {
      $addToSet: { [userField]: payment.propertyId },
    });

    res.status(200).json({
      success: true,
      data: payment,
      message: "Payment marked as completed successfully",
    });
  } catch (error) {
    console.error("Error marking payment as completed:", error);
    res.status(500).json({
      success: false,
      message: "Error marking payment as completed",
      error: error.message,
    });
  }
};

/**
 * Get payment plan details
 * @route GET /api/payments/plan
 * @access Private
 */
const getPaymentPlan = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get all active payment plans for the user
    const payments = await Payment.find({
      userId,
      paymentPlan: "Installment",
      status: { $ne: "Failed" },
    }).populate({
      path: "propertyId",
      select: "title location price",
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payment plans:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment plans",
      error: error.message,
    });
  }
};

/**
 * Update payment plan
 * @route PUT /api/payments/plan/:userId
 * @access Private/Admin
 */
const updatePaymentPlan = async (req, res) => {
  const { userId } = req.params;
  const { paymentId, totalInstallments, nextPaymentDue } = req.body;

  try {
    // Find the payment
    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Update payment plan
    payment.paymentPlan = "Installment";
    payment.installmentDetails = {
      totalInstallments,
      installmentsPaid: 1,
      nextPaymentDue: new Date(nextPaymentDue),
    };

    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
      message: "Payment plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating payment plan:", error);
    res.status(500).json({
      success: false,
      message: "Error updating payment plan",
      error: error.message,
    });
  }
};

/**
 * Get installment details for a payment
 * @route GET /api/payments/installments/:paymentId
 * @access Private
 */
const getInstallmentDetails = async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user._id;

  try {
    // Find payment with installment details
    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
      paymentPlan: "Installment",
    }).populate({
      path: "propertyId",
      select: "title location price images",
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Installment payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching installment details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching installment details",
      error: error.message,
    });
  }
};

/**
 * Process a payment
 * @route POST /api/payments/process
 * @access Private
 */
const processPayment = async (req, res) => {
  const userId = req.user._id;
  const {
    propertyId,
    propertyType,
    amount,
    method,
    paymentPlan,
    installmentDetails,
  } = req.body;

  try {
    // Validate property type
    if (!["Land", "House", "Apartment", "Service"].includes(propertyType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property type",
      });
    }

    // Check if property exists
    let model;

    switch (propertyType) {
      case "Land":
        model = Land;
        break;
      case "House":
        model = House;
        break;
      case "Apartment":
        model = Apartment;
        break;
      case "Service":
        model = Service;
        break;
    }

    const property = await model.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Create new payment
    const newPayment = new Payment({
      userId,
      amount,
      method,
      propertyType,
      propertyId,
      status: "Pending", // Initially set as pending
      paymentDate: new Date(),
      paymentPlan: paymentPlan || "Full Payment",
      installmentDetails,
    });

    await newPayment.save();

    // In a real application, you would integrate with a payment gateway here
    // For demo purposes, we'll simulate a successful payment

    // Update payment status to completed
    newPayment.status = "Completed";
    await newPayment.save();

    // If it's a full payment for a property, update property status
    if (propertyType !== "Service" && paymentPlan === "Full Payment") {
      await model.findByIdAndUpdate(propertyId, {
        status: "Sold",
        owner: userId,
        purchaseDate: new Date(),
      });
    }

    // Add property to user's purchased properties
    let userField;

    switch (propertyType) {
      case "Land":
        userField = "purchasedLands";
        break;
      case "House":
        userField = "purchasedHouses";
        break;
      case "Apartment":
        userField = "purchasedApartments";
        break;
      case "Service":
        userField = "subscribedServices";
        break;
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { [userField]: propertyId },
    });

    res.status(200).json({
      success: true,
      data: newPayment,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
};

module.exports = {
  getPaymentHistory,
  getPaymentDetails,
  getAllPayments,
  addPayment,
  markPaymentCompleted,
  getPaymentPlan,
  updatePaymentPlan,
  getInstallmentDetails,
  processPayment,
};
