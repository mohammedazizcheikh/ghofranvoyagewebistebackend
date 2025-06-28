const { Ferry } = require("../models/");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

// Get Ferries
exports.getFerries = async (req, res) => {
  try {
    const ferries = await Ferry.find().sort({ createdAt: -1 }).lean();
    sendSuccessResponse(res, ferries);
  } catch (error) {
    sendErrorResponse(res, "Error fetching ferries", 500, {
      error: error.message,
    });
  }
};
// Get Ferry by Id
exports.getFerryById = async (req, res) => {
  try {
    const { id } = req.params;
    const ferry = await Ferry.findById(id).lean();
    if (!ferry) {
      return sendErrorResponse(res, "Ferry not found", 404);
    }
    sendSuccessResponse(res, ferry);
  } catch (error) {
    sendErrorResponse(res, "Error fetching ferry", 500, {
      error: error.message,
    });
  }
};

// Update Ferry
exports.updateFerryById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(updateData)
    const ferry = await Ferry.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!ferry) {
      return sendErrorResponse(res, "Ferry not found", 404);
    }
    sendSuccessResponse(res, ferry);
  } catch (error) {
    sendErrorResponse(res, "Error Updating ferry", 500, {
      error: error.message,
    });
  }
};
// Delete Ferry
exports.deleteFerryById = async (req, res) => {
  try {
    const { id } = req.params;
    const ferry = await Ferry.findByIdAndDelete(id);
    if (!ferry) {
      return sendErrorResponse(res, "Ferry not found", 404);
    }
    sendSuccessResponse(res, { message: "Ferry deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, "Error deleting ferry", 500, {
      error: error.message,
    });
  }
};
// Create Ferry
exports.createFerry = async (req, res) => {
  try {
    const ferryData = req.body;
    console.log("Ferry Data from request body:", ferryData);
    const ferry = new Ferry(ferryData);
    await ferry.save();
    sendSuccessResponse(res, ferry);
  } catch (error) {
    sendErrorResponse(res, "Error creating ferry", 500, {
      error: error.message,
    });
  }
};
// Get Ferry by Reference Id
exports.getFerryByReferenceId = async (req, res) => {
  try {
    const ferry = await Ferry.findOne({
      bookingReference: req.params.ref,
    }).select("status contactInfo createdAt");

    if (!ferry) {
      return sendErrorResponse(res, "Ferry not found", 404);
    }

    // Format response with common structure
    const response = {
      status: ferry.status,
      createdAt: ferry.createdAt,
      user: {
        firstName: ferry.contactInfo.name,
        lastName: ferry.contactInfo.forename,
        email: ferry.contactInfo.email,
        phone: ferry.contactInfo.telephone,
      },
    };

    sendSuccessResponse(res, response);
  } catch (error) {
    sendErrorResponse(res, "Error fetching ferry by reference ID", 500, {
      error: error.message,
    });
  }
};
