const User = require("../models/User");
const Land = require("../models/Land");
const House = require("../models/House");
const Apartment = require("../models/Apartment");
const Service = require("../models/Service");
const Payment = require("../models/Payment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Admin login
 * @route POST /api/admin/login
 * @access Public
 */
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists and is an admin
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in admin",
      error: error.message,
    });
  }
};

/**
 * Get admin dashboard data
 * @route GET /api/admin/dashboard
 * @access Private/Admin
 */
const getAdminDashboardData = async (req, res) => {
  try {
    // Get counts
    const [
      userCount,
      landCount,
      houseCount,
      apartmentCount,
      serviceCount,
      paymentCount,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Land.countDocuments(),
      House.countDocuments(),
      Apartment.countDocuments(),
      Service.countDocuments(),
      Payment.countDocuments(),
    ]);

    // Get recent payments
    const recentPayments = await Payment.find()
      .sort({ paymentDate: -1 })
      .limit(5)
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "propertyId",
        select: "title location price",
      });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    // Calculate total revenue
    const payments = await Payment.find({ status: "Completed" });
    const totalRevenue = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    // Get property distribution
    const propertyDistribution = {
      lands: landCount,
      houses: houseCount,
      apartments: apartmentCount,
      services: serviceCount,
    };

    const dashboardData = {
      counts: {
        users: userCount,
        properties: landCount + houseCount + apartmentCount,
        services: serviceCount,
        payments: paymentCount,
      },
      recentPayments,
      recentUsers,
      totalRevenue,
      propertyDistribution,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin dashboard data",
      error: error.message,
    });
  }
};

/**
 * Get admin stats
 * @route GET /api/admin/stats
 * @access Private/Admin
 */
const getAdminStats = async (req, res) => {
  try {
    // Get counts
    const [
      userCount,
      landCount,
      houseCount,
      apartmentCount,
      serviceCount,
      paymentCount,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Land.countDocuments(),
      House.countDocuments(),
      Apartment.countDocuments(),
      Service.countDocuments(),
      Payment.countDocuments(),
    ]);

    // Calculate total revenue
    const payments = await Payment.find({ status: "Completed" });
    const totalRevenue = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    // Get property status distribution
    const availableLands = await Land.countDocuments({ status: "Available" });
    const soldLands = await Land.countDocuments({ status: "Sold" });

    const availableHouses = await House.countDocuments({ status: "Available" });
    const soldHouses = await House.countDocuments({ status: "Sold" });
    const rentedHouses = await House.countDocuments({ status: "Rented" });

    const availableApartments = await Apartment.countDocuments({
      status: "Available",
    });
    const soldApartments = await Apartment.countDocuments({ status: "Sold" });
    const rentedApartments = await Apartment.countDocuments({
      status: "Rented",
    });

    const stats = {
      counts: {
        users: userCount,
        lands: landCount,
        houses: houseCount,
        apartments: apartmentCount,
        services: serviceCount,
        payments: paymentCount,
      },
      revenue: totalRevenue,
      propertyStatus: {
        lands: {
          available: availableLands,
          sold: soldLands,
        },
        houses: {
          available: availableHouses,
          sold: soldHouses,
          rented: rentedHouses,
        },
        apartments: {
          available: availableApartments,
          sold: soldApartments,
          rented: rentedApartments,
        },
      },
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin stats",
      error: error.message,
    });
  }
};

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Private/Admin
 */
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get users
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

/**
 * Get user details
 * @route GET /api/admin/users/:userId
 * @access Private/Admin
 */
const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's properties
    const [
      purchasedLands,
      purchasedHouses,
      purchasedApartments,
      subscribedServices,
      payments,
    ] = await Promise.all([
      Land.find({ _id: { $in: user.purchasedLands } }),
      House.find({ _id: { $in: user.purchasedHouses } }),
      Apartment.find({ _id: { $in: user.purchasedApartments } }),
      Service.find({ _id: { $in: user.subscribedServices } }),
      Payment.find({ userId }).sort({ paymentDate: -1 }),
    ]);

    const userData = {
      user,
      properties: {
        lands: purchasedLands,
        houses: purchasedHouses,
        apartments: purchasedApartments,
        services: subscribedServices,
      },
      payments,
    };

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

/**
 * Update user role
 * @route PUT /api/admin/users/:userId/role
 * @access Private/Admin
 */
const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Update user role
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User role updated successfully",
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
};

/**
 * Delete user
 * @route DELETE /api/admin/users/:userId
 * @access Private/Admin
 */
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

/**
 * Get announcements
 * @route GET /api/admin/announcements
 * @access Private/Admin
 */
const getAnnouncements = async (req, res) => {
  try {
    // This is a placeholder for the announcements functionality
    // In a real application, you would have an Announcement model

    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching announcements",
      error: error.message,
    });
  }
};

/**
 * Add announcement
 * @route POST /api/admin/announcements
 * @access Private/Admin
 */
const addAnnouncement = async (req, res) => {
  try {
    // This is a placeholder for the announcements functionality
    // In a real application, you would have an Announcement model

    res.status(201).json({
      success: true,
      message: "Announcement added successfully",
    });
  } catch (error) {
    console.error("Error adding announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error adding announcement",
      error: error.message,
    });
  }
};

/**
 * Update announcement
 * @route PUT /api/admin/announcements/:id
 * @access Private/Admin
 */
const updateAnnouncement = async (req, res) => {
  try {
    // This is a placeholder for the announcements functionality
    // In a real application, you would have an Announcement model

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error updating announcement",
      error: error.message,
    });
  }
};

/**
 * Delete announcement
 * @route DELETE /api/admin/announcements/:id
 * @access Private/Admin
 */
const deleteAnnouncement = async (req, res) => {
  try {
    // This is a placeholder for the announcements functionality
    // In a real application, you would have an Announcement model

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting announcement",
      error: error.message,
    });
  }
};

/**
 * Get teams
 * @route GET /api/admin/teams
 * @access Private/Admin
 */
const getTeams = async (req, res) => {
  try {
    // This is a placeholder for the teams functionality
    // In a real application, you would have a Team model

    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching teams",
      error: error.message,
    });
  }
};

/**
 * Add team member
 * @route POST /api/admin/teams
 * @access Private/Admin
 */
const addTeamMember = async (req, res) => {
  try {
    // This is a placeholder for the teams functionality
    // In a real application, you would have a Team model

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
    });
  } catch (error) {
    console.error("Error adding team member:", error);
    res.status(500).json({
      success: false,
      message: "Error adding team member",
      error: error.message,
    });
  }
};

/**
 * Update team member
 * @route PUT /api/admin/teams/:id
 * @access Private/Admin
 */
const updateTeamMember = async (req, res) => {
  try {
    // This is a placeholder for the teams functionality
    // In a real application, you would have a Team model

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({
      success: false,
      message: "Error updating team member",
      error: error.message,
    });
  }
};

/**
 * Delete team member
 * @route DELETE /api/admin/teams/:id
 * @access Private/Admin
 */
const deleteTeamMember = async (req, res) => {
  try {
    // This is a placeholder for the teams functionality
    // In a real application, you would have a Team model

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting team member",
      error: error.message,
    });
  }
};

/**
 * Get inspections
 * @route GET /api/admin/inspections
 * @access Private/Admin
 */
const getInspections = async (req, res) => {
  try {
    // This is a placeholder for the inspections functionality
    // In a real application, you would have an Inspection model

    res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Error fetching inspections:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inspections",
      error: error.message,
    });
  }
};

/**
 * Add inspection
 * @route POST /api/admin/inspections
 * @access Private/Admin
 */
const addInspection = async (req, res) => {
  try {
    // This is a placeholder for the inspections functionality
    // In a real application, you would have an Inspection model

    res.status(201).json({
      success: true,
      message: "Inspection added successfully",
    });
  } catch (error) {
    console.error("Error adding inspection:", error);
    res.status(500).json({
      success: false,
      message: "Error adding inspection",
      error: error.message,
    });
  }
};

/**
 * Update inspection
 * @route PUT /api/admin/inspections/:id
 * @access Private/Admin
 */
const updateInspection = async (req, res) => {
  try {
    // This is a placeholder for the inspections functionality
    // In a real application, you would have an Inspection model

    res.status(200).json({
      success: true,
      message: "Inspection updated successfully",
    });
  } catch (error) {
    console.error("Error updating inspection:", error);
    res.status(500).json({
      success: false,
      message: "Error updating inspection",
      error: error.message,
    });
  }
};

/**
 * Delete inspection
 * @route DELETE /api/admin/inspections/:id
 * @access Private/Admin
 */
const deleteInspection = async (req, res) => {
  try {
    // This is a placeholder for the inspections functionality
    // In a real application, you would have an Inspection model

    res.status(200).json({
      success: true,
      message: "Inspection deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inspection:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting inspection",
      error: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  getAdminDashboardData,
  getAdminStats,
  getUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
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
};
