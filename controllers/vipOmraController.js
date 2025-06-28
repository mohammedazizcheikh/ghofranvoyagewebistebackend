const { VipOmra } = require("../models/");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

// Create a new VipOmra request
exports.createVipOmra = async (req, res) => {
  try {
    const vipOmra = new VipOmra({
      ...req.body,
      status: "pending",
    });
    const savedVipOmra = await vipOmra.save();
    sendSuccessResponse(res, savedVipOmra, 201);
  } catch (error) {
    sendErrorResponse(res, "Error creating VipOmra request", 400, {
      error: error.message,
    });
  }
};

// Get all VipOmra requests
exports.getAllVipOmra = async (req, res) => {
  try {
    const vipOmraRequests = await VipOmra.find();
    sendSuccessResponse(res, vipOmraRequests);
  } catch (error) {
    sendErrorResponse(res, "Error fetching VipOmra requests", 500, {
      error: error.message,
    });
  }
};

// Get a single VipOmra request by ID
exports.getVipOmraById = async (req, res) => {
  try {
    const vipOmra = await VipOmra.findById(req.params.id)
    if (!vipOmra) {
      return sendErrorResponse(res, "VipOmra request not found", 404);
    }
    sendSuccessResponse(res, vipOmra);
  } catch (error) {
    sendErrorResponse(res, "Error fetching VipOmra request", 500, {
      error: error.message,
    });
  }
};

// Update only status and append to notes of a VipOmra request by ID
exports.updateVipOmra = async (req, res) => {
  try {
    const { status } = req.body;


    if (!status) {
      return sendErrorResponse(res, "No valid fields to update", 400);
    }

    const updatedVipOmra = await VipOmra.findByIdAndUpdate(
      req.params.id,
      {status : status},
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedVipOmra) {
      return sendErrorResponse(res, "VipOmra request not found", 404);
    }
    sendSuccessResponse(res, updatedVipOmra);
  } catch (error) {
    sendErrorResponse(res, "Error updating VipOmra request", 400, {
      error:   error.message,
    });
  }
};

// Delete a VipOmra request by ID
exports.deleteVipOmra = async (req, res) => {
  try {
    const deletedVipOmra = await VipOmra.findByIdAndDelete(req.params.id);
    if (!deletedVipOmra) {
      return sendErrorResponse(res, "VipOmra request not found", 404);
    }
    sendSuccessResponse(res, {
      message: "VipOmra request deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(res, "Error deleting VipOmra request", 500, {
      error: error.message,
    });
  }
};

exports.getVipOmraByReferenceId = async (req, res) => {
  try {
    const vipOmra = await VipOmra.findOne({
      bookingReference: req.params.ref,
    }).select("status firstName lastName email phone createdAt");

    if (!vipOmra) {
      return sendErrorResponse(res, "VipOmra request not found", 404);
    }
    // Format response with common structure
    const response = {
      status: vipOmra.status,
      createdAt: vipOmra.createdAt,
      user: {
        firstName: vipOmra.firstName,
        lastName: vipOmra.lastName,
        email: vipOmra.email,
        phone: vipOmra.phone,
      },
    };

    sendSuccessResponse(res, response);
  } catch (error) {
    sendErrorResponse(res, "Error fetching vip omra by reference ID", 500, {
      error: error.message,
    });
  }
};