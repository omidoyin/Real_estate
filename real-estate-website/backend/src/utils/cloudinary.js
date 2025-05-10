const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "real-estate",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi", "pdf"],
    resource_type: "auto",
  },
});

// Create multer upload middleware
const upload = multer({ storage: storage });

// Middleware for handling multiple file uploads
const uploadMedia = (req, res, next) => {
  upload.array("media", 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Error uploading files",
        error: err.message,
      });
    }
    next();
  });
};

// Function to get optimized URLs for uploaded media
const getOptimizedUrls = (files) => {
  if (!files || !files.length) return [];

  return files.map((file) => {
    const { path } = file;

    // For images, add transformations for optimization
    if (path.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cloudinary.url(path, {
        quality: "auto",
        fetch_format: "auto",
        secure: true,
      });
    }

    // For videos, add transformations for optimization
    if (path.match(/\.(mp4|mov|avi)$/i)) {
      return cloudinary.url(path, {
        resource_type: "video",
        secure: true,
      });
    }

    // For PDFs, just return the secure URL
    return path;
  });
};

// Function to delete media from Cloudinary
const deleteMedia = async (urls) => {
  if (!urls || !urls.length) return;

  const deletePromises = urls.map((url) => {
    // Extract public_id from URL
    const publicId = url.split("/").pop().split(".")[0];

    // Determine resource type
    const resourceType = url.match(/\.(mp4|mov|avi)$/i) ? "video" : "image";

    // Delete from Cloudinary
    return cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  });

  await Promise.all(deletePromises);
};

module.exports = {
  uploadMedia,
  getOptimizedUrls,
  deleteMedia,
};
