const jwt = require("jsonwebtoken");
const { jwtRefreshSecret } = require("../config/env");
const { User } = require("../models/");
const { sendErrorResponse } = require("../utils/response");
const logger = require("winston"); // Assuming Logger is properly configured elsewhere

/**
 * Middleware to authenticate JWT tokens and handle role-based and permission-based access control.
 * @param {string} [allowedRole] - The role allowed to access the route.
 * @param {Array} [requiredPermissions] - Array of permissions required to access the route.
 */
const authMiddleware = (allowedRole = null, requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendErrorResponse(res, "Access denied. No token provided.", 401);
      }

      const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

      // Verify and decode token
      const decoded = jwt.verify(token, jwtRefreshSecret);

      // Fetch the user and their permissions/role
      const user = await User.findById(decoded.userId).populate(
        "role"
      );

      if (!user) {
        return sendErrorResponse(res, "User not found", 401);
      }
      // If a specific role is required, check user role
      if (allowedRole && user.role !== allowedRole) {
        return sendErrorResponse(
          res,
          "Access forbidden: insufficient role",
          401
        );
      }

      // If specific permissions are required, check user's permissions
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = user.permissions.some((permission) =>
          requiredPermissions.includes(permission.name)
        );
        if (!hasRequiredPermissions) {
          return sendErrorResponse(
            res,
            "Access forbidden: insufficient permissions",
            401
          );
        }
      }
      req.user = user;
      next();
    } catch (err) {
      // Handle JWT expiration and verification errors
      if (err.name === "TokenExpiredError") {
        return sendErrorResponse(
          res,
          "Token expired. Please log in again.",
          401
        );
      } else if (err.name === "JsonWebTokenError") {
        return sendErrorResponse(
          res,
          "Invalid token. Authorization failed.",
          401
        );
      } else {
        logger.error("Authorization error:", err);
        return sendErrorResponse(res, "Authorization error", 500);
      }
    }
  };
};

module.exports = authMiddleware;
