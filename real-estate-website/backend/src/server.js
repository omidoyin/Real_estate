const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Check if --no-db flag is provided
const skipDbConnection = process.argv.includes("--no-db");

if (skipDbConnection) {
  console.log(
    "Starting server without database connection (--no-db flag detected)"
  );
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} else {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      console.log(
        "Starting server anyway to allow testing of non-database endpoints"
      );
      app.listen(PORT, () => {
        console.log(
          `Server is running on http://localhost:${PORT} (without database connection)`
        );
      });
    });
}
