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
    images: [
      {
        type: String,
        required: true,
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
          required: true,
        },
        distance: {
          type: String,
          required: true,
        },
      },
    ],
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
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
