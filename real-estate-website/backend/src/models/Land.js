const mongoose = require("mongoose");

const landSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },
    type: {
      type: String,
      enum: ["Residential", "Commercial", "Industrial", "Agricultural"],
      default: "Residential",
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    video: {
      type: String,
      required: false,
    },
    brochureUrl: {
      type: String,
      required: false,
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    inspectionDates: [
      {
        type: Date,
        required: false,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
        required: false,
      },
    ],
    landmarks: [
      {
        name: {
          type: String,
          required: false,
        },
        distance: {
          type: String,
          required: false,
          default: "",
        },
      },
    ],
    documents: [
      {
        name: {
          type: String,
          required: false,
        },
        url: {
          type: String,
          required: false,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Land = mongoose.model("Land", landSchema);

module.exports = Land;
