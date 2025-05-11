const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const landRoutes = require("./routes/landRoutes");
const houseRoutes = require("./routes/houseRoutes");
const apartmentRoutes = require("./routes/apartmentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Log request details
  console.log(`\n------------------------------`);
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);

  if (req.body && Object.keys(req.body).length > 0) {
    // Don't log sensitive information like passwords
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = "[REDACTED]";
    if (sanitizedBody.token) sanitizedBody.token = "[REDACTED]";
    console.log(`Body: ${JSON.stringify(sanitizedBody)}`);
  }

  // Capture the response
  const originalSend = res.send;
  res.send = function (body) {
    const responseTime = Date.now() - start;
    console.log(`Response Status: ${res.statusCode}`);

    // Try to parse and log the response body if it's JSON
    try {
      const parsedBody = typeof body === "string" ? JSON.parse(body) : body;
      // Don't log sensitive information or large responses
      const sanitizedResponse = { ...parsedBody };
      if (sanitizedResponse.token) sanitizedResponse.token = "[REDACTED]";
      if (sanitizedResponse.password) sanitizedResponse.password = "[REDACTED]";

      // Truncate large responses
      const responseStr = JSON.stringify(sanitizedResponse);
      console.log(
        `Response Body: ${
          responseStr.length > 500
            ? responseStr.substring(0, 500) + "... [truncated]"
            : responseStr
        }`
      );
    } catch (e) {
      // If it's not JSON or there's an error parsing, just log the status
      console.log(`Response Body: [Not JSON or parsing error]`);
    }

    console.log(`Response Time: ${responseTime}ms`);
    console.log(`------------------------------\n`);

    originalSend.apply(res, arguments);
  };

  next();
});

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication logging middleware
const authLoggingMiddleware = (req, res, next) => {
  // Only log auth and admin routes in detail
  if (req.path.includes("/auth") || req.path.includes("/admin")) {
    console.log(`\n🔐 AUTH REQUEST: ${req.method} ${req.originalUrl}`);
    console.log(`Authorization Header: ${req.headers.authorization || "None"}`);

    // Check for token in the request
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log(`Token present: ${token ? "Yes" : "No"}`);
    }
  }
  next();
};

// Apply auth logging middleware
app.use(authLoggingMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/favorites", favoriteRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
