const Land = require("../models/Land");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const { getOptimizedUrls } = require("../utils/cloudinary");
const cloudinary = require("cloudinary").v2;

/**
 * Get all available lands with pagination and sorting
 * @route GET /api/lands
 * @access Public
 */
const getAvailableLands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Only get lands with status "Available"
    const filter = { status: "Available" };

    const lands = await Land.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Land.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: lands,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching lands:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lands",
      error: error.message,
    });
  }
};

/**
 * Get all lands for admin (including sold ones) with pagination and sorting
 * @route GET /api/admin/lands
 * @access Private/Admin
 */
const getAllLands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Get all lands regardless of status
    const lands = await Land.find({})
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Land.countDocuments({});

    res.status(200).json({
      success: true,
      data: lands,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching all lands:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all lands",
      error: error.message,
    });
  }
};

/**
 * Get land details by ID
 * @route GET /api/lands/:id
 * @access Public
 */
const getLandDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const land = await Land.findById(id);
    if (!land) {
      return res.status(404).json({
        success: false,
        message: "Land not found",
      });
    }
    res.status(200).json({
      success: true,
      data: land,
    });
  } catch (error) {
    console.error("Error fetching land details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching land details",
      error: error.message,
    });
  }
};

/**
 * Add a new land
 * @route POST /api/lands
 * @access Private/Admin
 */
const addLand = async (req, res) => {
  try {
    console.log("=== ADD LAND DEBUG ===");
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const {
      title,
      location,
      price,
      size,
      type,
      description,
      features,
      landmarks,
      documents,
      images,
      video,
      brochureUrl,
    } = req.body;

    // Validate required fields
    if (!title || !location || !price || !size || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: title, location, price, size, description",
      });
    }

    // Create new land
    const newLand = new Land({
      title,
      location,
      price: Number(price),
      size,
      type: type || "Residential",
      images: Array.isArray(images) ? images : images ? [images] : [],
      video: video || "",
      brochureUrl: brochureUrl || "",
      description,
      features: Array.isArray(features) ? features : features ? [features] : [],
      landmarks: Array.isArray(landmarks)
        ? landmarks
        : landmarks
        ? [landmarks]
        : [],
      documents: Array.isArray(documents)
        ? documents
        : documents
        ? [documents]
        : [],
    });

    console.log("Land object to save:", newLand);

    await newLand.save();

    console.log("Land saved successfully:", newLand._id);

    res.status(201).json({
      success: true,
      data: newLand,
      message: "Land added successfully",
    });
  } catch (error) {
    console.error("Error adding land:", error);
    console.error("Error details:", error.message);
    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
    }
    res.status(500).json({
      success: false,
      message: "Error adding land",
      error: error.message,
    });
  }
};

/**
 * Edit an existing land
 * @route PUT /api/lands/:id
 * @access Private/Admin
 */
const editLand = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("=== EDIT LAND DEBUG ===");
    console.log("Edit land request body:", req.body);

    // Find land to update
    const land = await Land.findById(id);
    if (!land) {
      return res.status(404).json({
        success: false,
        message: "Land not found",
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Ensure arrays are properly formatted
    if (updateData.features && !Array.isArray(updateData.features)) {
      updateData.features = [];
    }
    if (updateData.landmarks && !Array.isArray(updateData.landmarks)) {
      updateData.landmarks = [];
    }
    if (updateData.documents && !Array.isArray(updateData.documents)) {
      updateData.documents = [];
    }
    if (updateData.images && !Array.isArray(updateData.images)) {
      updateData.images = [];
    }

    // Update land
    const updatedLand = await Land.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedLand,
      message: "Land updated successfully",
    });
  } catch (error) {
    console.error("Error updating land:", error);
    res.status(500).json({
      success: false,
      message: "Error updating land",
      error: error.message,
    });
  }
};

/**
 * Delete a land
 * @route DELETE /api/lands/:id
 * @access Private/Admin
 */
const deleteLand = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLand = await Land.findByIdAndDelete(id);
    if (!deletedLand) {
      return res.status(404).json({
        success: false,
        message: "Land not found",
      });
    }

    // Remove land from user favorites
    await Favorite.deleteMany({ propertyType: "Land", propertyId: id });

    // Remove land from user purchased lands
    await User.updateMany(
      { purchasedLands: id },
      { $pull: { purchasedLands: id } }
    );

    res.status(200).json({
      success: true,
      message: "Land deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting land:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting land",
      error: error.message,
    });
  }
};

/**
 * Add land to user favorites
 * @route POST /api/lands/favorites/:id
 * @access Private
 */
const addLandToFavorites = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Check if land exists
    const land = await Land.findById(id);
    if (!land) {
      return res.status(404).json({
        success: false,
        message: "Land not found",
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId,
      propertyType: "Land",
      propertyId: id,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Land already in favorites",
      });
    }

    // Add to favorites
    const favorite = new Favorite({
      userId,
      propertyType: "Land",
      propertyId: id,
    });

    await favorite.save();

    // Also add to user's favoriteLands array
    await User.findByIdAndUpdate(userId, { $addToSet: { favoriteLands: id } });

    res.status(200).json({
      success: true,
      message: "Land added to favorites successfully",
    });
  } catch (error) {
    console.error("Error adding land to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error adding land to favorites",
      error: error.message,
    });
  }
};

/**
 * Remove land from user favorites
 * @route DELETE /api/lands/favorites/:id
 * @access Private
 */
const removeLandFromFavorites = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Remove from favorites collection
    const result = await Favorite.findOneAndDelete({
      userId,
      propertyType: "Land",
      propertyId: id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Land not found in favorites",
      });
    }

    // Also remove from user's favoriteLands array
    await User.findByIdAndUpdate(userId, { $pull: { favoriteLands: id } });

    res.status(200).json({
      success: true,
      message: "Land removed from favorites successfully",
    });
  } catch (error) {
    console.error("Error removing land from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error removing land from favorites",
      error: error.message,
    });
  }
};

/**
 * Get user's favorite lands
 * @route GET /api/lands/favorites
 * @access Private
 */
const getUserFavoriteLands = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get favorites from Favorite collection
    const favorites = await Favorite.find({
      userId,
      propertyType: "Land",
    });

    // Extract land IDs
    const landIds = favorites.map((fav) => fav.propertyId);

    // Get land details
    const lands = await Land.find({ _id: { $in: landIds } });

    res.status(200).json({
      success: true,
      data: lands,
    });
  } catch (error) {
    console.error("Error fetching favorite lands:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching favorite lands",
      error: error.message,
    });
  }
};

/**
 * Get user's purchased lands
 * @route GET /api/lands/my-lands
 * @access Private
 */
const getUserPurchasedLands = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get user with populated purchasedLands
    const user = await User.findById(userId).populate("purchasedLands");

    res.status(200).json({
      success: true,
      data: user.purchasedLands,
    });
  } catch (error) {
    console.error("Error fetching purchased lands:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching purchased lands",
      error: error.message,
    });
  }
};

/**
 * Search lands by title or location
 * @route GET /api/lands/search
 * @access Public
 */
const searchLands = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Create search filter
    const filter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      status: "Available",
    };

    // Execute search
    const lands = await Land.find(filter).skip(skip).limit(limit);

    const total = await Land.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: lands,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error searching lands:", error);
    res.status(500).json({
      success: false,
      message: "Error searching lands",
      error: error.message,
    });
  }
};

/**
 * Filter lands by various criteria
 * @route GET /api/lands/filter
 * @access Public
 */
const filterLands = async (req, res) => {
  try {
    const { minPrice, maxPrice, location, size, sortBy, sortOrder } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: "Available" };

    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (size) {
      filter.size = { $regex: size, $options: "i" };
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    // Execute query
    const lands = await Land.find(filter).sort(sort).skip(skip).limit(limit);

    const total = await Land.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: lands,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error filtering lands:", error);
    res.status(500).json({
      success: false,
      message: "Error filtering lands",
      error: error.message,
    });
  }
};

/**
 * Get Cloudinary signature for direct upload
 * @route GET /api/lands/cloudinary-signature
 * @access Private/Admin
 */
const getCloudinarySignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "real-estate/lands"; // Organize uploads in folders

    // Parameters for the signature - MUST match exactly what Cloudinary expects
    // Note: resource_type=auto is default and should NOT be included in signature
    const params = {
      folder: folder,
      timestamp: timestamp,
    };

    console.log("=== CLOUDINARY SIGNATURE GENERATION ===");
    console.log("Timestamp:", timestamp);
    console.log("Folder:", folder);
    console.log("Resource type: auto (NOT included in signature)");
    console.log("Params for signature (sorted):", params);

    // Manual verification of parameter string (for debugging)
    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    console.log("Parameter string for signature:", paramString);
    console.log(
      "Parameter string + secret:",
      paramString + process.env.CLOUDINARY_API_SECRET
    );

    // Generate signature using Cloudinary SDK (should handle sorting automatically)
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    console.log("Generated signature:", signature);
    console.log("API Key:", process.env.CLOUDINARY_API_KEY);
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

    const responseData = {
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    };

    console.log("Sending response data:", responseData);

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    res.status(500).json({
      success: false,
      message: "Error generating upload signature",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableLands,
  getAllLands,
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
};
