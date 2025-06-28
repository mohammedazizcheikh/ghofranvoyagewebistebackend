const express = require("express");
const router = express.Router();
const { flightController } = require("../controllers/");
const { handleImageUploads } = require("../config/cloudinary");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new flight
router.post(
  "/",
  flightController.createFlight
);
// Get all flights
router.get("/", authMiddleware(), flightController.getAllFlights);

// Get flight by ID
router.get("/:id", authMiddleware(), flightController.getFlightById);

// Update flight by ID
router.put("/:id", authMiddleware(), flightController.updateFlight);

// Delete flight by ID
router.delete("/:id", authMiddleware(), flightController.deleteFlight);
// Get flight by reference ID
router.get(
  "/ref/:ref",
  flightController.getFlightByReferenceId
);

module.exports = router;
