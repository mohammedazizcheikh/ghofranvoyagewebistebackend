const Booking = require("../models/BookingModel");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

exports.createBooking = async (req, res) => {
  try {
    const {
      customer,
      serviceType,
      serviceId,
      serviceName,
      startDate,
      endDate,
      adults,
      children,
      totalAmount,
      specialRequests,
      currency,
    } = req.body;

    console.log("start booking services");

    const booking = new Booking({
      customer,
      serviceType,
      serviceId,
      serviceName,
      startDate,
      endDate,
      adults: adults || 1,
      children: children || 0,
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      currency,
      status: "pending",
      paymentStatus: "unpaid",
      specialRequests,
    });

    const savedBooking = await booking.save();
    sendSuccessResponse(res, savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    sendErrorResponse(res, "Error creating booking.", 500);
  }
};

//get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
    sendSuccessResponse(res, bookings);
  } catch (error) {
    sendErrorResponse(res, "Error fetching bookings.", 500);
  }
};

//get booking by id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking) {
      return sendErrorResponse(res, "Booking not found.", 404);
    }
    sendSuccessResponse(res, booking);
  } catch {
    sendErrorResponse(res, "Error fetching booking.", 500);
  }
};


exports.getBookingByReferenceId = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingReference: req.params.ref,
    }).select("status customer createdAt");

    if (!booking) {
      return sendErrorResponse(res, "Booking not found", 404);
    }

    // Format response with common structure
    const response = {
      status: booking.status,
      createdAt: booking.createdAt,
      user: {
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        email: booking.customer.email,
        phone: booking.customer.phone,
      },
    };

    sendSuccessResponse(res, response);
  } catch (error) {
    sendErrorResponse(res, "Error fetching booking by reference ID", 500, {
      error: error.message,
    });
  }
};


//update booking by id
exports.updateBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidAmount, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status,
        paidAmount,
        paymentStatus,
      },
      {
        new: true,
        runValidators: true,
        context: "query", 
      }
    );

    if (!booking) {
      return sendErrorResponse(res, "Booking not found", 404);
    }

    sendSuccessResponse(res, booking);
  } catch (error) {
    sendErrorResponse(res, "Error updating booking", 400, {
      error: error.message,
    });
  }
};

//delete booking by id
exports.deleteBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return sendErrorResponse(res, "Booking not found", 404);
    }
    sendSuccessResponse(res, {
      message: "Booking deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(res, "Error deleting booking", 400, {
      error: error.message,
    });
  }
};
