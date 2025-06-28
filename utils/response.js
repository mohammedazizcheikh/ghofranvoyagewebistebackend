/**
 * Sends a success response.
 * @param {Object} res - The Express response object.
 * @param {Object} data - The data to include in the response.
 * @param {number} [statusCode=200] - The HTTP status code.
 */
const sendSuccessResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};

/**
 * Send an error response.
 * @param {Object} res - The Express response object.
 * @param {string} message - The error message.
 * @param {number} [statusCode=500] - The HTTP status code.
 * @param {Object} [details] - Optional additional details about the error.
 */
const sendErrorResponse = (res, message, statusCode = 500, details = {}) => {
  res.status(statusCode).json({
    status: "error",
    message,
    ...details,
  });
};

module.exports = { sendSuccessResponse, sendErrorResponse };
