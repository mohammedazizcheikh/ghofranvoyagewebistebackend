const { Omra } = require("../models");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { extractPublicId } = require("../utils/helpers");
const { deleteFromCloudinary } = require("../config/cloudinary");

// Create an Omra package
exports.createOmra = async (req, res) => {
  try {
    const {
      packageName,
      packageType,
      description,
      departureCity,
      duration,
      price,
      tax,
      packageHighlights,
      hotel,
      transport,
      accommodationDetails,
      itinerary,
      includedServices,
      excludedServices,
      mealsIncluded,
      visaIncluded,
      guideAvailable,
      departureOptions,
      departureDate,
      returnDate,
      bookingConstraints,
    } = req.body;

    console.log(req.body);
    if (
      !packageName ||
      !description ||
      !departureCity ||
      !duration ||
      !price ||
      !departureDate ||
      !returnDate ||
      !departureOptions
    ) {
      return sendErrorResponse(res, "Missing required fields", 400);
    }

    let images = [];
    if (req.cloudinaryResults) {
      images = req.cloudinaryResults.map((file) => file.secure_url);
    }

    const newOmra = new Omra({
      packageName,
      packageType,
      description,
      departureCity,
      destination: "Mecca",
      duration,
      price,
      tax,
      packageHighlights,
      hotel,
      transport,
      accommodationDetails,
      itinerary,
      includedServices,
      excludedServices,
      mealsIncluded,
      visaIncluded,
      guideAvailable,
      departureOptions,
      departureDate,
      returnDate,
      images,
      bookingConstraints,
    });

    await newOmra.save();

    sendSuccessResponse(res, newOmra);
  } catch (error) {
    sendErrorResponse(res, "Error creating Omra package", 400, {
      error: error.message,
    });
  }
};

// Update an Omra package
exports.updateOmra = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.cloudinaryResults) {
      updates.images = req.cloudinaryResults.map((file) => file.secure_url);
    }

    const omra = await Omra.findByIdAndUpdate(id, updates, {
      new: true,
    })

    if (!omra) {
      return sendErrorResponse(res, "Omra package not found", 404);
    }

    sendSuccessResponse(res, omra);
  } catch (error) {
    sendErrorResponse(res, "Error updating Omra package", 400, {
      error: error.message,
    });
  }
};

// Get an Omra package by ID
exports.getOmra = async (req, res) => {
  try {
    const omra = await Omra.findById(req.params.id)
    if (!omra) {
      return sendErrorResponse(res, "Omra package not found", 404);
    }
    sendSuccessResponse(res, omra);
  } catch (error) {
    sendErrorResponse(res, "Error fetching Omra package", 400, {
      error: error.message,
    });
  }
};

// Get all Omra packages
exports.getAllOmras = async (req, res) => {
  try {
    const omras = await Omra.find()
    sendSuccessResponse(res, omras);
  } catch (error) {
    sendErrorResponse(res, "Error fetching Omra packages", 400, {
      error: error.message,
    });
  }
};
exports.deleteOmra = async (req, res) => {
  try {
    const omra = await Omra.findById(req.params.id);

    if (!omra) {
      return sendErrorResponse(res, "omra not found", 404);
    }

    // Delete associated images from Cloudinary
    if (omra.images && omra.images.length > 0) {
      await Promise.all(
        omra.images.map(async (imageUrl) => {
          console.log("image url", imageUrl);
          const publicId = extractPublicId(imageUrl);
          console.log("public id", publicId);
          await deleteFromCloudinary(publicId);
        })
      );
    }

    // Delete travel document from database
    await Omra.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, {
      message: "Omra deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(res, "Error deleting Omra", 400, {
      error: error.message,
    });
  }
};

// get by type
exports.getOmraByType = async (req, res) => {
  try {
    const { type } = req.params;
    const omras = await Omra.find({ packageType: type, status :"active"});
    if (!omras) {
      return sendErrorResponse(res, "No Omra packages found for this type", 404);
    }
    sendSuccessResponse(res, omras);
  } catch (error) {
    sendErrorResponse(res, "Error fetching Omra packages by type", 400, {
      error: error.message,
    });
  }
};