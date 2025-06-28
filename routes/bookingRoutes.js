const express = require("express");
const router = express.Router();
const { bookingController } = require("../controllers/");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", bookingController.createBooking);
router.get("/", authMiddleware(), bookingController.getAllBookings);
router.get("/:id", authMiddleware(), bookingController.getBookingById);
router.put("/:id", authMiddleware(), bookingController.updateBookingById);
router.delete("/:id", authMiddleware(), bookingController.deleteBookingById);
//get by ref
router.get("/ref/:ref", bookingController.getBookingByReferenceId);






module.exports = router;
