const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'real-estate', // The name of the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4'], // Allowed formats
  },
});

// Create a multer instance with the Cloudinary storage
const upload = multer({ storage: storage });

// Function to upload images/videos to Cloudinary
const uploadMedia = (req, res, next) => {
  upload.array('media', 10)(req, res, (error) => {
    if (error) {
      return res.status(500).json({ message: 'Upload failed', error });
    }
    next();
  });
};

// Function to get optimized URLs for uploaded media
const getOptimizedUrls = (media) => {
  return media.map((file) => file.path);
};

module.exports = {
  uploadMedia,
  getOptimizedUrls,
};