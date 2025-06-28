const { Transfer } = require("../models/");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

// Create a new transfer
exports.createTransfer = async (req, res) => {
  try {
    const transfer = new Transfer(req.body);
    await transfer.save();
    sendSuccessResponse(res, transfer, 201);
  } catch (error) {
    sendErrorResponse(res, "Error creating transfer", 400, {
      error: error.message,
    });
  }
};

// Get all transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
    sendSuccessResponse(res, transfers);
  } catch (error) {
    sendErrorResponse(res, "Error fetching transfers", 500, {
      error: error.message,
    });
  }
};

// Get a single transfer by ID
exports.getTransferById = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
    if (!transfer) {
      return sendErrorResponse(res, "Transfer not found", 404);
    }
    sendSuccessResponse(res, transfer);
  } catch (error) {
    sendErrorResponse(res, "Error fetching transfer", 500, {
      error: error.message,
    });
  }
};

// Update a transfer by ID
exports.updateTransfer = async (req, res) => {
  console.log(req.body);
  try {
    const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!transfer) {
      return sendErrorResponse(res, "Transfer not found", 404);
    }
    sendSuccessResponse(res, transfer);
  } catch (error) {
    sendErrorResponse(res, "Error updating transfer", 400, {
      error: error.message,
    });
  }
};

// Delete a transfer by ID
exports.deleteTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer) {
      return sendErrorResponse(res, "Transfer not found", 404);
    }
    sendSuccessResponse(res, { message: "Transfer deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, "Error deleting transfer", 500, {
      error: error.message,
    });
  }
};

// Get transfers by reference ID
exports.getTransferByReferenceId = async (req, res) => {
  try {
    const transfer = await Transfer.findOne({
      bookingReference: req.params.ref,
    }).select("status firstName lastName email phone createdAt");

    if (!transfer) {
      return sendErrorResponse(res, "Transfer not found", 404);
    }

    // Format response with common structure
    const response = {
      status: transfer.status,
      createdAt: transfer.createdAt,
      user: {
        firstName: transfer.firstName,
        lastName: transfer.lastName,
        email: transfer.email,
        phone: transfer.phone,
      },
    };

    sendSuccessResponse(res, response);
  } catch (error) {
    sendErrorResponse(res, "Error fetching transfer by reference ID", 500, {
      error: error.message,
    });
  }
};
