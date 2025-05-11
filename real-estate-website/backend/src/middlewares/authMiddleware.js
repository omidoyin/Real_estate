const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication middleware to verify user token
 * Checks for token in Authorization header or cookies
 */
const authMiddleware = async (req, res, next) => {
  console.log(`\n🔑 AUTH MIDDLEWARE CALLED: ${req.method} ${req.originalUrl}`);

  try {
    // Get token from Authorization header or cookies
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token;

    console.log(`Token extracted: ${token ? "Yes" : "No"}`);

    if (!token) {
      console.log(`❌ AUTH FAILED: No token provided for ${req.originalUrl}`);
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Log token details (safely)
    if (token) {
      try {
        // Only log non-sensitive parts of the token
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          console.log(`Token format: Valid JWT (3 parts)`);

          // Try to decode the payload (middle part) without verification
          try {
            const payload = JSON.parse(
              Buffer.from(tokenParts[1], "base64").toString()
            );
            console.log(
              `Token payload contains: ${Object.keys(payload).join(", ")}`
            );
            console.log(
              `Token expiry: ${
                payload.exp
                  ? new Date(payload.exp * 1000).toISOString()
                  : "Not found"
              }`
            );
            console.log(
              `Token issued at: ${
                payload.iat
                  ? new Date(payload.iat * 1000).toISOString()
                  : "Not found"
              }`
            );
          } catch (e) {
            console.log(`Could not decode token payload: ${e.message}`);
          }
        } else {
          console.log(`Token format: Invalid (not 3 parts)`);
        }
      } catch (e) {
        console.log(`Error examining token: ${e.message}`);
      }
    }

    // Verify token
    console.log(`Verifying token with JWT...`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`✅ Token verified successfully`);

    // Find user by id
    console.log(`Looking up user with ID: ${decoded.id}`);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log(`❌ AUTH FAILED: User not found for ID: ${decoded.id}`);
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    console.log(
      `✅ User found: ${user.email} (${user._id}), Role: ${user.role}`
    );

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ AUTH MIDDLEWARE ERROR:", error);
    console.log(`Error name: ${error.name}, Message: ${error.message}`);
    console.log(`Request path: ${req.originalUrl}, Method: ${req.method}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);

    if (error.name === "JsonWebTokenError") {
      console.log(`❌ AUTH FAILED: Invalid token`);
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    if (error.name === "TokenExpiredError") {
      console.log(`❌ AUTH FAILED: Token expired`);
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }

    console.log(`❌ AUTH FAILED: Server error`);
    res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

/**
 * Admin middleware to verify user has admin role
 * Must be used after authMiddleware
 */
const adminMiddleware = (req, res, next) => {
  console.log(`\n👑 ADMIN MIDDLEWARE CALLED: ${req.method} ${req.originalUrl}`);

  // Check if user exists in request (set by authMiddleware)
  if (!req.user) {
    console.log(
      `❌ ADMIN AUTH FAILED: No user in request. authMiddleware might not have been called.`
    );
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
  }

  console.log(
    `Checking admin privileges for user: ${req.user.email} (${req.user._id})`
  );
  console.log(`User role: ${req.user.role}`);

  if (req.user.role === "admin") {
    console.log(`✅ ADMIN AUTH SUCCESSFUL: User has admin privileges`);
    next();
  } else {
    console.log(`❌ ADMIN AUTH FAILED: User does not have admin role`);
    res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
