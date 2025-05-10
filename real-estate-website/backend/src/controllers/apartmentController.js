const Apartment = require("../models/Apartment");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const { getOptimizedUrls } = require("../utils/cloudinary");

/**
 * Get all available apartments with pagination and sorting
 * @route GET /api/apartments
 * @access Public
 */
const getAvailableApartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Only get apartments with status "Available" or "For Rent"
    const filter = { status: { $in: ["Available", "For Rent"] } };

    const apartments = await Apartment.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Apartment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: apartments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching apartments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching apartments",
      error: error.message,
    });
  }
};

/**
 * Get apartment details by ID
 * @route GET /api/apartments/:id
 * @access Public
 */
const getApartmentDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: apartment,
    });
  } catch (error) {
    console.error("Error fetching apartment details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching apartment details",
      error: error.message,
    });
  }
};

/**
 * Add a new apartment
 * @route POST /api/apartments
 * @access Private/Admin
 */
const addApartment = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      size,
      status,
      bedrooms,
      bathrooms,
      floor,
      unit,
      description,
      features,
      landmarks,
      documents,
      yearBuilt,
      hasBalcony,
      hasParkingSpace,
      hasElevator,
      buildingAmenities,
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

    // Create new apartment
    const newApartment = new Apartment({
      title,
      location,
      price,
      size,
      status,
      bedrooms,
      bathrooms,
      floor,
      unit,
      images,
      video,
      brochureUrl,
      description,
      features: features ? JSON.parse(features) : [],
      landmarks: landmarks ? JSON.parse(landmarks) : [],
      documents: documents ? JSON.parse(documents) : [],
      yearBuilt,
      hasBalcony: hasBalcony === "true",
      hasParkingSpace: hasParkingSpace === "true",
      hasElevator: hasElevator === "true",
      buildingAmenities: buildingAmenities ? JSON.parse(buildingAmenities) : [],
      rentPrice,
      rentPeriod,
    });

    await newApartment.save();

    res.status(201).json({
      success: true,
      data: newApartment,
      message: "Apartment added successfully",
    });
  } catch (error) {
    console.error("Error adding apartment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding apartment",
      error: error.message,
    });
  }
};

/**
 * Edit an existing apartment
 * @route PUT /api/apartments/:id
 * @access Private/Admin
 */
const editApartment = async (req, res) => {
  const { id } = req.params;
  try {
    // Find apartment to update
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found",
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
        req.body.images = [...apartment.images, ...newImages];
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

    if (req.body.buildingAmenities) {
      req.body.buildingAmenities = JSON.parse(req.body.buildingAmenities);
    }

    // Convert boolean strings to actual booleans
    if (req.body.hasBalcony) {
      req.body.hasBalcony = req.body.hasBalcony === "true";
    }

    if (req.body.hasParkingSpace) {
      req.body.hasParkingSpace = req.body.hasParkingSpace === "true";
    }

    if (req.body.hasElevator) {
      req.body.hasElevator = req.body.hasElevator === "true";
    }

    // Update apartment
    const updatedApartment = await Apartment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedApartment,
      message: "Apartment updated successfully",
    });
  } catch (error) {
    console.error("Error updating apartment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating apartment",
      error: error.message,
    });
  }
};

/**
 * Delete an apartment
 * @route DELETE /api/apartments/:id
 * @access Private/Admin
 */
const deleteApartment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedApartment = await Apartment.findByIdAndDelete(id);
    if (!deletedApartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found",
      });
    }

    // Remove apartment from user favorites
    await Favorite.deleteMany({ propertyType: "Apartment", propertyId: id });

    // Remove apartment from user purchased apartments
    await User.updateMany(
      { purchasedApartments: id },
      { $pull: { purchasedApartments: id } }
    );

    res.status(200).json({
      success: true,
      message: "Apartment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting apartment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting apartment",
      error: error.message,
    });
  }
};

/**
 * Add apartment to user favorites
 * @route POST /api/apartments/favorites/:id
 * @access Private
 */
const addApartmentToFavorites = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Check if apartment exists
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found",
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId,
      propertyType: "Apartment",
      propertyId: id,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Apartment already in favorites",
      });
    }

    // Add to favorites
    const favorite = new Favorite({
      userId,
      propertyType: "Apartment",
      propertyId: id,
    });

    await favorite.save();

    // Also add to user's favoriteApartments array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { favoriteApartments: id },
    });

    res.status(200).json({
      success: true,
      message: "Apartment added to favorites successfully",
    });
  } catch (error) {
    console.error("Error adding apartment to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error adding apartment to favorites",
      error: error.message,
    });
  }
};

/**
 * Remove apartment from user favorites
 * @route DELETE /api/apartments/favorites/:id
 * @access Private
 */
const removeApartmentFromFavorites = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Remove from favorites collection
    const result = await Favorite.findOneAndDelete({
      userId,
      propertyType: "Apartment",
      propertyId: id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found in favorites",
      });
    }

    // Also remove from user's favoriteApartments array
    await User.findByIdAndUpdate(userId, { $pull: { favoriteApartments: id } });

    res.status(200).json({
      success: true,
      message: "Apartment removed from favorites successfully",
    });
  } catch (error) {
    console.error("Error removing apartment from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Error removing apartment from favorites",
      error: error.message,
    });
  }
};

/**
 * Get user's favorite apartments
 * @route GET /api/apartments/favorites
 * @access Private
 */
const getUserFavoriteApartments = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get favorites from Favorite collection
    const favorites = await Favorite.find({
      userId,
      propertyType: "Apartment",
    });

    // Extract apartment IDs
    const apartmentIds = favorites.map((fav) => fav.propertyId);

    // Get apartment details
    const apartments = await Apartment.find({ _id: { $in: apartmentIds } });

    res.status(200).json({
      success: true,
      data: apartments,
    });
  } catch (error) {
    console.error("Error fetching favorite apartments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching favorite apartments",
      error: error.message,
    });
  }
};

/**
 * Get user's purchased apartments
 * @route GET /api/apartments/my-apartments
 * @access Private
 */
const getUserPurchasedApartments = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get user with populated purchasedApartments
    const user = await User.findById(userId).populate("purchasedApartments");

    res.status(200).json({
      success: true,
      data: user.purchasedApartments,
    });
  } catch (error) {
    console.error("Error fetching purchased apartments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching purchased apartments",
      error: error.message,
    });
  }
};

/**
 * Search apartments by title, location, or description
 * @route GET /api/apartments/search
 * @access Public
 */
const searchApartments = async (req, res) => {
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
    const apartments = await Apartment.find(filter).skip(skip).limit(limit);

    const total = await Apartment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: apartments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error searching apartments:", error);
    res.status(500).json({
      success: false,
      message: "Error searching apartments",
      error: error.message,
    });
  }
};

/**
 * Filter apartments by various criteria
 * @route GET /api/apartments/filter
 * @access Public
 */
const filterApartments = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      location,
      size,
      bedrooms,
      bathrooms,
      floor,
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

    if (floor) {
      filter.floor = floor;
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
    const apartments = await Apartment.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Apartment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: apartments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error filtering apartments:", error);
    res.status(500).json({
      success: false,
      message: "Error filtering apartments",
      error: error.message,
    });
  }
};

module.exports = {
  getAvailableApartments,
  getApartmentDetails,
  addApartment,
  editApartment,
  deleteApartment,
  addApartmentToFavorites,
  removeApartmentFromFavorites,
  getUserFavoriteApartments,
  getUserPurchasedApartments,
  searchApartments,
  filterApartments,
};
