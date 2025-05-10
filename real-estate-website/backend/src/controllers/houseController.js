const House = require("../models/House");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const { getOptimizedUrls } = require("../utils/cloudinary");

/**
 * Get all available houses with pagination and sorting
 * @route GET /api/houses
 * @access Public
 */
const getAvailableHouses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Only get houses with status "Available" or "For Rent"
    const filter = { status: { $in: ["Available", "For Rent"] } };

    const houses = await House.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await House.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: houses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching houses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching houses",
      error: error.message,
    });
  }
};

/**
 * Get house details by ID
 * @route GET /api/houses/:id
 * @access Public
 */
const getHouseDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const house = await House.findById(id);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }
    res.status(200).json({
      success: true,
      data: house,
    });
  } catch (error) {
    console.error("Error fetching house details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching house details",
      error: error.message,
    });
  }
};

/**
 * Add a new house
 * @route POST /api/houses
 * @access Private/Admin
 */
const addHouse = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      size,
      status,
      propertyType,
      bedrooms,
      bathrooms,
      description,
      features,
      landmarks,
      documents,
      yearBuilt,
      garage,
      garageCapacity,
      hasGarden,
      hasPool,
      rentPrice,
      rentPeriod,
    } = req.body;

    // Process uploaded media files
    let images = [];
    let video = "";
    let brochureUrl = "";

    if (req.files) {
      // Get optimized URLs for uploaded media
      const mediaUrls = getOptimizedUrls(req.files);

      // Filter images, video, and brochure
      images = mediaUrls.filter(
        (url) =>
          url.endsWith(".jpg") ||
          url.endsWith(".jpeg") ||
          url.endsWith(".png") ||
          url.endsWith(".gif")
      );

      const videos = mediaUrls.filter(
        (url) =>
          url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".avi")
      );

      if (videos.length > 0) {
        video = videos[0]; // Use the first video
      }

      const brochures = mediaUrls.filter((url) => url.endsWith(".pdf"));

      if (brochures.length > 0) {
        brochureUrl = brochures[0]; // Use the first brochure
      }
    }

    // Create new house
    const newHouse = new House({
      title,
      location,
      price,
      size,
      status,
      propertyType,
      bedrooms,
      bathrooms,
      images,
      video,
      brochureUrl,
      description,
      features: features ? JSON.parse(features) : [],
      landmarks: landmarks ? JSON.parse(landmarks) : [],
      documents: documents ? JSON.parse(documents) : [],
      yearBuilt,
      garage: garage === "true",
      garageCapacity,
      hasGarden: hasGarden === "true",
      hasPool: hasPool === "true",
      rentPrice,
      rentPeriod,
    });

    await newHouse.save();

    res.status(201).json({
      success: true,
      data: newHouse,
      message: "House added successfully",
    });
  } catch (error) {
    console.error("Error adding house:", error);
    res.status(500).json({
      success: false,
      message: "Error adding house",
      error: error.message,
    });
  }
};

/**
 * Edit an existing house
 * @route PUT /api/houses/:id
 * @access Private/Admin
 */
const editHouse = async (req, res) => {
  const { id } = req.params;
  try {
    // Find house to update
    const house = await House.findById(id);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    // Process uploaded media files
    if (req.files && req.files.length > 0) {
      // Get optimized URLs for uploaded media
      const mediaUrls = getOptimizedUrls(req.files);

      // Filter images, video, and brochure
      const newImages = mediaUrls.filter(
        (url) =>
          url.endsWith(".jpg") ||
          url.endsWith(".jpeg") ||
          url.endsWith(".png") ||
          url.endsWith(".gif")
      );

      if (newImages.length > 0) {
        // Append new images to existing ones
        req.body.images = [...house.images, ...newImages];
      }

      const videos = mediaUrls.filter(
        (url) =>
          url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".avi")
      );

      if (videos.length > 0) {
        req.body.video = videos[0]; // Use the first video
      }

      const brochures = mediaUrls.filter((url) => url.endsWith(".pdf"));

      if (brochures.length > 0) {
        req.body.brochureUrl = brochures[0]; // Use the first brochure
      }
    }

    // Parse JSON strings if they exist
    if (req.body.features) {
      req.body.features = JSON.parse(req.body.features);
    }

    if (req.body.landmarks) {
      req.body.landmarks = JSON.parse(req.body.landmarks);
    }

    if (req.body.documents) {
      req.body.documents = JSON.parse(req.body.documents);
    }

    // Convert boolean strings to actual booleans
    if (req.body.garage) {
      req.body.garage = req.body.garage === "true";
    }

    if (req.body.hasGarden) {
      req.body.hasGarden = req.body.hasGarden === "true";
    }

    if (req.body.hasPool) {
      req.body.hasPool = req.body.hasPool === "true";
    }

    // Update house
    const updatedHouse = await House.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedHouse,
      message: "House updated successfully",
    });
  } catch (error) {
    console.error("Error updating house:", error);
    res.status(500).json({
      success: false,
      message: "Error updating house",
      error: error.message,
    });
  }
};

/**
 * Delete a house
 * @route DELETE /api/houses/:id
 * @access Private/Admin
 */
const deleteHouse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedHouse = await House.findByIdAndDelete(id);
    if (!deletedHouse) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    // Remove house from user favorites
    await Favorite.deleteMany({ propertyType: "House", propertyId: id });

    // Remove house from user purchased houses
    await User.updateMany(
      { purchasedHouses: id },
      { $pull: { purchasedHouses: id } }
    );

    res.status(200).json({
      success: true,
      message: "House deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting house:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting house",
      error: error.message,
    });
  }
};

/**
 * Add house to user favorites
 * @route POST /api/houses/favorites/:id
 * @access Private
 */
const addHouseToFavorites = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Check if house exists
    const house = await House.findById(id);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId,
      propertyType: "House",
      propertyId: id,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "House already in favorites",
      });
    }

    // Add to favorites
    const favorite = new Favorite({
      userId,
      propertyType: "House",
      propertyId: id,
    });

    await favorite.save();

    // Also add to user's favoriteHouses array
    await User.findByIdAndUpdate(userId, { $addToSet: { favoriteHouses: id } });

    res.status(200).json({
      success: true,
      message: "House added to favorites successfully",
    });
  } catch (error) {
    console.error("Error adding house to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error adding house to favorites",
      error: error.message,
    });
  }
};

/**
 * Remove house from user favorites
 * @route DELETE /api/houses/favorites/:id
 * @access Private
 */
const removeHouseFromFavorites = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Remove from favorites collection
    const result = await Favorite.findOneAndDelete({
      userId,
      propertyType: "House",
      propertyId: id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "House not found in favorites",
      });
    }

    // Also remove from user's favoriteHouses array
    await User.findByIdAndUpdate(userId, { $pull: { favoriteHouses: id } });

    res.status(200).json({
      success: true,
      message: "House removed from favorites successfully",
    });
  } catch (error) {
    console.error("Error removing house from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error removing house from favorites",
      error: error.message,
    });
  }
};

/**
 * Get user's favorite houses
 * @route GET /api/houses/favorites
 * @access Private
 */
const getUserFavoriteHouses = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get favorites from Favorite collection
    const favorites = await Favorite.find({
      userId,
      propertyType: "House",
    });

    // Extract house IDs
    const houseIds = favorites.map((fav) => fav.propertyId);

    // Get house details
    const houses = await House.find({ _id: { $in: houseIds } });

    res.status(200).json({
      success: true,
      data: houses,
    });
  } catch (error) {
    console.error("Error fetching favorite houses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching favorite houses",
      error: error.message,
    });
  }
};

/**
 * Get user's purchased houses
 * @route GET /api/houses/my-houses
 * @access Private
 */
const getUserPurchasedHouses = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get user with populated purchasedHouses
    const user = await User.findById(userId).populate("purchasedHouses");

    res.status(200).json({
      success: true,
      data: user.purchasedHouses,
    });
  } catch (error) {
    console.error("Error fetching purchased houses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching purchased houses",
      error: error.message,
    });
  }
};

/**
 * Search houses by title, location, or description
 * @route GET /api/houses/search
 * @access Public
 */
const searchHouses = async (req, res) => {
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
      status: { $in: ["Available", "For Rent"] },
    };

    // Execute search
    const houses = await House.find(filter).skip(skip).limit(limit);

    const total = await House.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: houses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error searching houses:", error);
    res.status(500).json({
      success: false,
      message: "Error searching houses",
      error: error.message,
    });
  }
};

/**
 * Filter houses by various criteria
 * @route GET /api/houses/filter
 * @access Public
 */
const filterHouses = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      location,
      size,
      bedrooms,
      bathrooms,
      propertyType,
      status,
      sortBy,
      sortOrder,
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: { $in: ["Available", "For Rent"] } };

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

    if (bedrooms) {
      filter.bedrooms = bedrooms;
    }

    if (bathrooms) {
      filter.bathrooms = bathrooms;
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (status && (status === "Available" || status === "For Rent")) {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    // Execute query
    const houses = await House.find(filter).sort(sort).skip(skip).limit(limit);

    const total = await House.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: houses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error filtering houses:", error);
    res.status(500).json({
      success: false,
      message: "Error filtering houses",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableHouses,
  getHouseDetails,
  addHouse,
  editHouse,
  deleteHouse,
  addHouseToFavorites,
  removeHouseFromFavorites,
  getUserFavoriteHouses,
  getUserPurchasedHouses,
  searchHouses,
  filterHouses,
};
