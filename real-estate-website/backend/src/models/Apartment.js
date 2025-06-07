const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
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
      enum: ["Available", "Sold", "Reserved", "For Rent", "Rented"],
      default: "Available",
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
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
    yearBuilt: {
      type: Number,
      required: false,
    },
    hasBalcony: {
      type: Boolean,
      default: false,
    },
    hasParkingSpace: {
      type: Boolean,
      default: false,
    },
    hasElevator: {
      type: Boolean,
      default: false,
    },
    buildingAmenities: [
      {
        type: String,
        required: false,
      },
    ],
    rentPrice: {
      type: Number,
      required: function () {
        return this.status === "For Rent" || this.status === "Rented";
      },
    },
    rentPeriod: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      required: function () {
        return this.status === "For Rent" || this.status === "Rented";
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
