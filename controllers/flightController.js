const { Flight } = require("../models");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

//create

exports.createFlight = async (req, res) => {
  try {
    const flightData = req.body;
    const flight = await Flight.create(flightData);
    return sendSuccessResponse(res, flight, 201);
  } catch (error) {
    return sendErrorResponse(
      res,
      "Failed to create flight",
      500,
      error.message
    );
  }
};
//get all flights
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    return sendSuccessResponse(res, flights);
  } catch (error) {
    return sendErrorResponse(
      res,
      "Failed to retrieve flights",
      500,
      error.message
    );
  }
};
//get flight by id
exports.getFlightById = async (req, res) => {
  try {
    const flightId = req.params.id;
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return sendErrorResponse(res, "Flight not found" , 400);
    }
    return sendSuccessResponse(res, flight);
  } catch (error) {
    return sendErrorResponse(
      res,
      "Failed to retrieve flight",
      500,
      error.message
    );
  }
};

//update flight
exports.updateFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const flightData = req.body;
    const flight = await Flight.findByIdAndUpdate(flightId, flightData, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      return sendErrorResponse(res, "Flight not found", 404);
    }
    return sendSuccessResponse(res, flight);
  } catch (error) {
    return sendErrorResponse(
      res,
      "Failed to update flight",
      500,
      error.message
    );
  }
};

//delete flight
exports.deleteFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const flight = await Flight.findByIdAndDelete(flightId);
    if (!flight) {
      return sendErrorResponse(res, "Flight not found", 404);
    }
    return sendSuccessResponse(res, "Flight deleted successfully");
  } catch (error) {
    return sendErrorResponse(
      res,
      "Failed to delete flight",
      500,
      error.message
    );
  }
};

//get flight by ref



exports.getFlightByReferenceId = async (req, res) => {
  try {
    const flight = await Flight.findOne({
      bookingReference: req.params.ref,
    }).select("status contactInfo createdAt");

    if (!flight) {
      return sendErrorResponse(res, "Flight not found", 404);
    }

    // Format response with common structure
    const response = {
      status: flight.status,
      createdAt: flight.createdAt,
      user: {
        firstName: flight.contactInfo.name,
        lastName: flight.contactInfo.forename,
        email: flight.contactInfo.email,
        phone: flight.contactInfo.telephone,
      },
    };

    sendSuccessResponse(res, response);
  } catch (error) {
    sendErrorResponse(res, "Error fetching flight by reference ID", 500, {
      error: error.message,
    });
  }
};
