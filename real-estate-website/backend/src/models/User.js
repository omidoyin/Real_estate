const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    purchasedLands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Land",
      },
    ],
    purchasedHouses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
      },
    ],
    purchasedApartments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apartment",
      },
    ],
    favoriteLands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Land",
      },
    ],
    favoriteHouses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "House",
      },
    ],
    favoriteApartments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apartment",
      },
    ],
    subscribedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
