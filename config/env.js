require("dotenv").config();

module.exports = {
  // App settings
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  dbUri: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",

  // JWT settings
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET || "your_jwt_refresh_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Password & Security
  passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS, 10) || 10,
  resetPasswordExpiration: process.env.RESET_PASSWORD_EXPIRATION || "1h",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4000",

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Cloudinary
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApikey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  // Partner API
  partnerApi: {
    url: process.env.API_URL || "",
    login: process.env.API_LOGIN || "",
    password: process.env.API_PASSWORD || "",
  },
};
