const User = require("../models/User");
const Land = require("../models/Land");
const House = require("../models/House");
const Apartment = require("../models/Apartment");
const Service = require("../models/Service");
const Payment = require("../models/Payment");
const Announcement = require("../models/Announcement");
const Team = require("../models/Team");
const Inspection = require("../models/Inspection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Admin login
 * @route POST /api/admin/login
 * @access Public
 */
const adminLogin = async (req, res) => {
  console.log(`\n🔐 ADMIN LOGIN ATTEMPT`);
  const { email, password } = req.body;

  console.log(`Login attempt for email: ${email}`);

  try {
    // Check if user exists and is an admin
    console.log(`Looking up admin user with email: ${email}`);
    const admin = await User.findOne({ email });

    if (!admin) {
      console.log(`❌ ADMIN LOGIN FAILED: User with email ${email} not found`);
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    console.log(
      `User found: ${admin.email} (${admin._id}), Role: ${admin.role}`
    );

    // Check if user is an admin
    if (admin.role !== "admin") {
      console.log(
        `❌ ADMIN LOGIN FAILED: User ${email} is not an admin (role: ${admin.role})`
      );
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Check password
    console.log(`Verifying password for admin: ${admin.email}`);
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log(`❌ ADMIN LOGIN FAILED: Invalid password for ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log(`✅ Password verified successfully for admin: ${admin.email}`);

    // Generate JWT token
    console.log(`Generating JWT token for admin: ${admin.email}`);
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log(`Token generated with expiry: 1 day`);

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log(`✅ ADMIN LOGIN SUCCESSFUL: ${admin.email} (${admin._id})`);

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
    console.error("❌ ERROR DURING ADMIN LOGIN:", error);
    console.log(`Error name: ${error.name}, Message: ${error.message}`);
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
    const announcements = await Announcement.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: announcements,
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
    const { title, content, type, startDate, endDate, status, target, image } =
      req.body;

    // Validate required fields
    if (!title || !content || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create new announcement
    const announcement = new Announcement({
      title,
      content,
      type: type || "General",
      startDate,
      endDate,
      status: status || "Active",
      target: target || "All Users",
      image,
    });

    await announcement.save();

    res.status(201).json({
      success: true,
      message: "Announcement added successfully",
      data: announcement,
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
    const { id } = req.params;
    const { title, content, type, startDate, endDate, status, target, image } =
      req.body;

    // Find announcement
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Update fields
    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (type) announcement.type = type;
    if (startDate) announcement.startDate = startDate;
    if (endDate) announcement.endDate = endDate;
    if (status) announcement.status = status;
    if (target) announcement.target = target;
    if (image) announcement.image = image;

    await announcement.save();

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
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
    const { id } = req.params;

    // Find and delete announcement
    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

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
    const teams = await Team.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: teams,
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
    const { name, position, email, phone, bio, status, socialMedia } = req.body;
    let photo = null;

    // Check if media was uploaded
    if (req.file) {
      photo = req.file.path; // Cloudinary URL
    }

    // Validate required fields
    if (!name || !position || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create new team member
    const teamMember = new Team({
      name,
      position,
      email,
      phone,
      photo,
      bio,
      status: status || "Active",
      socialMedia: socialMedia || {},
    });

    await teamMember.save();

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: teamMember,
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
    const { id } = req.params;
    const { name, position, email, phone, bio, status, socialMedia } = req.body;

    // Find team member
    const teamMember = await Team.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

    // Update fields
    if (name) teamMember.name = name;
    if (position) teamMember.position = position;
    if (email) teamMember.email = email;
    if (phone) teamMember.phone = phone;
    if (bio) teamMember.bio = bio;
    if (status) teamMember.status = status;
    if (socialMedia) teamMember.socialMedia = socialMedia;

    // Check if media was uploaded
    if (req.file) {
      teamMember.photo = req.file.path; // Cloudinary URL
    }

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: teamMember,
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
    const { id } = req.params;

    // Find and delete team member
    const teamMember = await Team.findByIdAndDelete(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }

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
    const inspections = await Inspection.find()
      .sort({ date: -1 })
      .populate("client", "name email phone")
      .populate({
        path: "property",
        select: "title location price",
      })
      .populate("agent", "name position email");

    res.status(200).json({
      success: true,
      data: inspections,
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
    const {
      client,
      property,
      propertyType,
      date,
      status,
      agent,
      notes,
      followUpDate,
    } = req.body;

    // Validate required fields
    if (!client || !property || !propertyType || !date || !agent) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Create new inspection
    const inspection = new Inspection({
      client,
      property,
      propertyType,
      date,
      status: status || "Scheduled",
      agent,
      notes,
      followUpDate,
    });

    await inspection.save();

    // Populate the inspection data for the response
    const populatedInspection = await Inspection.findById(inspection._id)
      .populate("client", "name email phone")
      .populate({
        path: "property",
        select: "title location price",
      })
      .populate("agent", "name position email");

    res.status(201).json({
      success: true,
      message: "Inspection added successfully",
      data: populatedInspection,
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
    const { id } = req.params;
    const {
      client,
      property,
      propertyType,
      date,
      status,
      agent,
      notes,
      feedback,
      followUpDate,
    } = req.body;

    // Find inspection
    const inspection = await Inspection.findById(id);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found",
      });
    }

    // Update fields
    if (client) inspection.client = client;
    if (property) inspection.property = property;
    if (propertyType) inspection.propertyType = propertyType;
    if (date) inspection.date = date;
    if (status) inspection.status = status;
    if (agent) inspection.agent = agent;
    if (notes) inspection.notes = notes;
    if (feedback) inspection.feedback = feedback;
    if (followUpDate) inspection.followUpDate = followUpDate;

    await inspection.save();

    // Populate the inspection data for the response
    const populatedInspection = await Inspection.findById(inspection._id)
      .populate("client", "name email phone")
      .populate({
        path: "property",
        select: "title location price",
      })
      .populate("agent", "name position email");

    res.status(200).json({
      success: true,
      message: "Inspection updated successfully",
      data: populatedInspection,
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
    const { id } = req.params;

    // Find and delete inspection
    const inspection = await Inspection.findByIdAndDelete(id);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found",
      });
    }

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
