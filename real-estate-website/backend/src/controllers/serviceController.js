const Service = require("../models/Service");
const User = require("../models/User");
const { getOptimizedUrls } = require("../utils/cloudinary");

/**
 * Get all services
 * @route GET /api/services
 * @access Public
 */
const getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Only get active services
    const filter = { status: "Active" };

    const services = await Service.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error.message,
    });
  }
};

/**
 * Get service details by ID
 * @route GET /api/services/:id
 * @access Public
 */
const getServiceDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching service details",
      error: error.message,
    });
  }
};

/**
 * Add a new service
 * @route POST /api/services
 * @access Private/Admin
 */
const addService = async (req, res) => {
  try {
    const {
      title,
      serviceType,
      propertyType,
      description,
      price,
      location,
      features,
      benefits,
      duration,
      status,
    } = req.body;

    // Process uploaded media files
    let images = [];

    if (req.files) {
      // Get optimized URLs for uploaded media
      const mediaUrls = getOptimizedUrls(req.files);

      // Filter images
      images = mediaUrls.filter(
        (url) =>
          url.endsWith(".jpg") ||
          url.endsWith(".jpeg") ||
          url.endsWith(".png") ||
          url.endsWith(".gif")
      );
    }

    // Create new service
    const newService = new Service({
      title,
      serviceType,
      propertyType,
      description,
      price,
      location,
      images,
      features,
      benefits,
      duration,
      status: status || "Active",
    });

    await newService.save();

    res.status(201).json({
      success: true,
      data: newService,
      message: "Service added successfully",
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({
      success: false,
      message: "Error adding service",
      error: error.message,
    });
  }
};

/**
 * Edit an existing service
 * @route PUT /api/services/:id
 * @access Private/Admin
 */
const editService = async (req, res) => {
  const { id } = req.params;
  try {
    // Find service to update
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Process uploaded media files
    if (req.files && req.files.length > 0) {
      // Get optimized URLs for uploaded media
      const mediaUrls = getOptimizedUrls(req.files);

      // Filter images
      const newImages = mediaUrls.filter(
        (url) =>
          url.endsWith(".jpg") ||
          url.endsWith(".jpeg") ||
          url.endsWith(".png") ||
          url.endsWith(".gif")
      );

      if (newImages.length > 0) {
        // Append new images to existing ones
        req.body.images = [...service.images, ...newImages];
      }
    }

    // Update service
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedService,
      message: "Service updated successfully",
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Error updating service",
      error: error.message,
    });
  }
};

/**
 * Delete a service
 * @route DELETE /api/services/:id
 * @access Private/Admin
 */
const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Remove service from user subscribed services
    await User.updateMany(
      { subscribedServices: id },
      { $pull: { subscribedServices: id } }
    );

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting service",
      error: error.message,
    });
  }
};

/**
 * Get estate management services
 * @route GET /api/services/estate-management
 * @access Public
 */
const getEstateManagementServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      serviceType: "Estate Management",
      status: "Active",
    };

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching estate management services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching estate management services",
      error: error.message,
    });
  }
};

/**
 * Get architectural design services
 * @route GET /api/services/architectural-design
 * @access Public
 */
const getArchitecturalDesignServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      serviceType: "Architectural Design",
      status: "Active",
    };

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching architectural design services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching architectural design services",
      error: error.message,
    });
  }
};

/**
 * Get property valuation services
 * @route GET /api/services/property-valuation
 * @access Public
 */
const getPropertyValuationServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      serviceType: "Property Valuation",
      status: "Active",
    };

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching property valuation services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching property valuation services",
      error: error.message,
    });
  }
};

/**
 * Get legal consultation services
 * @route GET /api/services/legal-consultation
 * @access Public
 */
const getLegalConsultationServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      serviceType: "Legal Consultation",
      status: "Active",
    };

    const services = await Service.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching legal consultation services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching legal consultation services",
      error: error.message,
    });
  }
};

/**
 * Subscribe to a service
 * @route POST /api/services/subscribe/:id
 * @access Private
 */
const subscribeToService = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Check if service exists
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if already subscribed
    const user = await User.findById(userId);
    if (user.subscribedServices.includes(id)) {
      return res.status(400).json({
        success: false,
        message: "Already subscribed to this service",
      });
    }

    // Add user to service subscribers
    await Service.findByIdAndUpdate(id, { $addToSet: { subscribers: userId } });

    // Add service to user subscribed services
    await User.findByIdAndUpdate(userId, {
      $addToSet: { subscribedServices: id },
    });

    res.status(200).json({
      success: true,
      message: "Successfully subscribed to service",
    });
  } catch (error) {
    console.error("Error subscribing to service:", error);
    res.status(500).json({
      success: false,
      message: "Error subscribing to service",
      error: error.message,
    });
  }
};

/**
 * Unsubscribe from a service
 * @route DELETE /api/services/subscribe/:id
 * @access Private
 */
const unsubscribeFromService = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Check if service exists
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Check if subscribed
    const user = await User.findById(userId);
    if (!user.subscribedServices.includes(id)) {
      return res.status(400).json({
        success: false,
        message: "Not subscribed to this service",
      });
    }

    // Remove user from service subscribers
    await Service.findByIdAndUpdate(id, { $pull: { subscribers: userId } });

    // Remove service from user subscribed services
    await User.findByIdAndUpdate(userId, { $pull: { subscribedServices: id } });

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from service",
    });
  } catch (error) {
    console.error("Error unsubscribing from service:", error);
    res.status(500).json({
      success: false,
      message: "Error unsubscribing from service",
      error: error.message,
    });
  }
};

/**
 * Get user's subscribed services
 * @route GET /api/services/my-services
 * @access Private
 */
const getUserSubscribedServices = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get user with populated subscribedServices
    const user = await User.findById(userId).populate("subscribedServices");

    res.status(200).json({
      success: true,
      data: user.subscribedServices,
    });
  } catch (error) {
    console.error("Error fetching subscribed services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscribed services",
      error: error.message,
    });
  }
};

module.exports = {
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
  getUserSubscribedServices,
};
