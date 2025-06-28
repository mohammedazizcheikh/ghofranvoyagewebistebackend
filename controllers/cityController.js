// cityController.js
const { City } = require("../models");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

// Get Cities
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    sendSuccessResponse(res, cities);
  } catch (error) {
    sendErrorResponse(res, "Error fetching cities", 500, {
      error: error.message,
    });
  }
};

// Get City by Id
exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id);
    if (!city) {
      return sendErrorResponse(res, "City not found", 404);
    }
    sendSuccessResponse(res, city);
  } catch (error) {
    sendErrorResponse(res, "Error fetching city", 500, {
      error: error.message,
    });
  }
};

// Update City
exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const city = await City.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!city) {
      return sendErrorResponse(res, "City not found", 404);
    }

    sendSuccessResponse(res, city);
  } catch (error) {
    sendErrorResponse(res, "Error updating city", 400, {
      error: error.message,
    });
  }
};

// Delete City
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCity = await City.findByIdAndDelete(id);

    if (!deletedCity) {
      return sendErrorResponse(res, "City not found", 404);
    }

    sendSuccessResponse(res, { message: "City deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, "Error deleting city", 500, {
      error: error.message,
    });
  }
};
