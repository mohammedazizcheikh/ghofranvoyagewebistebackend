const errorHandler = (err, req, res, next) => {
  // Handle ValidationError from Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  // Handle Duplicate Key Errors (e.g., unique index violations)
  if (err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "Duplicate Key Error",
      details: err.keyValue,
    });
  }

  // Handle JSON Web Token (JWT) errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid Token",
    });
  }

  // Handle Token Expiration Errors
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token Expired",
    });
  }

  // Handle Syntax Errors (e.g., malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      status: "error",
      message: "Malformed JSON",
    });
  }

  // Handle other errors
  console.error(err); // Log the error for debugging purposes
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    error: err.message,
  });
};

module.exports = errorHandler;
