const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/hotelBookingController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", bookingController.createBooking);

router.get("/", authMiddleware(), bookingController.getAllBookings);

// GET /api/bookings/:id - Get booking by ID
router.get("/:id", authMiddleware(), bookingController.getBookingById);

// PATCH /api/bookings/:id/status - Update booking status
router.patch(
  "/:id",
  authMiddleware(),
  bookingController.updateBookingStatus
);

// DELETE /api/bookings/:id - Delete booking by ID
router.delete("/:id", authMiddleware(), bookingController.deleteBookingById);

// get by reference id
router.get(
  "/ref/:ref",
  bookingController.getBookingByReferenceId
);

module.exports = router;
