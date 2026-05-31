const errorMiddleware = (err, req, res, next) => {

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    message = "Invalid resource ID";
    statusCode = 400;
  }

  // Duplicate key (unique fields)
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;