const { Trip } = require("../models");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { deleteCloudinaryImages } = require("../utils/helpers");
exports.createTrip = async (req, res) => {
  try {
    const {
      title,
      tripType,
      description,
      transport,
      transportType,
      departureCity,
      destination,
      duration,
      departureDate,
      returnDate,
      departureOptions,
      tax,
      includedServices,
      excludedServices,
      tripHighlights,
      price,
      maxParticipants,
      travelerType,
      itinerary,
      status,
      accommodationDetails,
      guideAvailable,
    } = req.body;
    // Validate required fields
    console.log(req.body);

    if (
      !title ||
      !description ||
      !departureCity ||
      !destination ||
      !price ||
      !departureDate
    ) {
      return sendErrorResponse(res, "Missing required fields", 400);
    }

    let images = [];
    if (req.cloudinaryResults) {
      // Store image URLs from Cloudinary
      images = req.cloudinaryResults.map((file) => file.secure_url);
      console.log("Uploaded images:", images);
    }

    // Create a new trip with the parsed data
    const newTrip = new Trip({
      title,
      tripType,
      description,
      transport,
      departureCity,
      transportType,
      destination,
      duration,
      departureDate,
      returnDate,
      departureOptions,
      tax,
      includedServices,
      excludedServices,
      tripHighlights,
      price,
      maxParticipants,
      travelerType,
      itinerary,
      status,
      accommodationDetails,
      guideAvailable,
      images,
    });

    await newTrip.save();

    sendSuccessResponse(res, newTrip);
  } catch (error) {
    console.error("Error creating trip:", error);
    sendErrorResponse(res, "Error creating trip", 400, {
      error: error.message,
    });
  }
};

// Update a trip by ID
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Updates received:", updates);


    const trip = await Trip.findByIdAndUpdate(id, updates, {
      new: true,
    })

    if (!trip) {
      return sendErrorResponse(res, "Trip not found", 404);
    }

    sendSuccessResponse(res, trip);
  } catch (error) {
    sendErrorResponse(res, "Error updating trip", 400, {
      error: error.message,
    });
  }
};

// Get a trip by ID
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    if (!trip) {
      return sendErrorResponse(res, "Trip not found", 404);
    }

    sendSuccessResponse(res, trip);
  } catch (error) {
    sendErrorResponse(res, "Error fetching trip", 400, {
      error: error.message,
    });
  }
};

// Get all trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    if (!trips) return sendErrorResponse(res, "something wrang");
    sendSuccessResponse(res, trips);
  } catch (error) {
    sendErrorResponse(res, "Error fetching trips", 400, {
      error: error.message,
    });
  }
};

// Delete a trip by ID
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    console.log("Trip to delete:", trip);

    if (!trip) {
      return sendErrorResponse(res, "trip not found", 404);
    }

    // Delete associated images from Cloudinary
    if (trip.images && trip.images.length > 0) {
      deleteCloudinaryImages(trip.images);
    }

    await Trip.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, {
      message: "trip deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(res, "Error deleting trip", 400, {
      error: error.message,
    });
  }
};

// Get a trip by type
exports.getTripByType = async (req, res) => {
  try {
    console.log(req.params.type);
    const trips = await Trip.find({ tripType: req.params.type , status:"active"});

    if (!trips) {
      return sendErrorResponse(res, "No trips found for this type", 404);
    }
    sendSuccessResponse(res, trips);
  } catch (error) {
    sendErrorResponse(res, "Error fetching trips", 400, {
      error: error.message,
    });
  }
};


// get all active trips
