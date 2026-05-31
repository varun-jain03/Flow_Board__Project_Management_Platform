// Dependencies
const jwt = require("jsonwebtoken");

// File Imports
const ApiError = require('../utils/ApiError.js');
require('dotenv').config();

// Auth Middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized...");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or Expaired Token..."));
  }
}

module.exports = authMiddleware;