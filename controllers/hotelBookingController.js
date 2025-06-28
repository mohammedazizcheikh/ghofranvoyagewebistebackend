const Booking = require("../models/HotelBookingModel");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    console.log(JSON.stringify(booking, null, 2));
    const newBooking = await booking.save();
    if (!newBooking) return sendErrorResponse(res, "Error creating booking");
    sendSuccessResponse(res, newBooking);
  } catch (error) {
    sendErrorResponse(res, "server error", 500);
  }
};

// @desc    Get all bookings (admin use)
// @route   GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    if (!bookings)
      return sendErrorResponse(res, "Error fetching hotel bookings");
    sendSuccessResponse(res, bookings);
  } catch (error) {
    sendErrorResponse(res, "Failed to fetch hotel bookings", 500);
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return sendErrorResponse(res, "Booking not found", 404);
    sendSuccessResponse(res, booking);
  } catch (error) {
    sendErrorResponse(res, "Failed to fetch booking", 500);
  }
};

// @desc    Update booking status (admin)
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  console.log('data stat' , req.body)

  const { status } = req.body;
  if (!status) {
    return sendErrorResponse(res, "Status is required", 400); 
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (status) booking.status = status;

    await booking.save();
    sendSuccessResponse(res, booking);
  } catch (error) {
    sendErrorResponse(res, "Failed to update status", 500);
  }
};

// @desc    Delete a booking by ID
// @route   DELETE /api/bookings/:id

exports.deleteBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return sendErrorResponse(res, "Booking not found", 404);
    sendSuccessResponse(res, { message: "Booking deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, "Failed to delete booking", 500);
  }
};
// @desc    Get booking by reference ID
// @route   GET /api/bookings/ref/:ref


exports.getBookingByReferenceId = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.ref,
    }).select("status bookingInfo createdAt");

    if (!booking) {
      return sendErrorResponse(res, "Booking not found", 404);
    }

    // Format response with common structure
    const response = {
      status: booking.status,
      createdAt: booking.createdAt,
      user: {
        firstName: booking.bookingInfo.mainGuest.firstName,
        lastName: booking.bookingInfo.mainGuest.lastName,
        email: booking.bookingInfo.mainGuest.email,
        phone: booking.bookingInfo.mainGuest.phone,
      },
    };

    sendSuccessResponse(res, response);
  } catch (error) {
    sendErrorResponse(res, "Error fetching booking by reference ID", 500, {
      error: error.message,
    });
  }
};
