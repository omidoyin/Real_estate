// Simple test server to debug Cloudinary signature
require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Cloudinary signature route (simplified for testing)
app.get('/api/lands/cloudinary-signature', (req, res) => {
  try {
    console.log('Cloudinary signature request received');
    console.log('Environment variables:');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "real-estate/lands";

    // Parameters for the signature
    const params = {
      timestamp,
      folder,
      resource_type: "auto",
    };

    console.log('Signature params:', params);

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      params,
      process.env.CLOUDINARY_API_SECRET
    );

    console.log('Generated signature:', signature);

    const responseData = {
      success: true,
      data: {
        signature,
        timestamp,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
      },
    };

    console.log('Sending response:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    res.status(500).json({
      success: false,
      message: "Error generating upload signature",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Test server is running on http://localhost:${PORT}`);
  console.log('Environment check:');
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
});
