const express = require("express");
const router = express.Router();
const { ferryController } = require("../controllers/");
const { handleImageUploads } = require("../config/cloudinary");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new ferry
router.post(
  "/",
  ferryController.createFerry
);
// Get all ferries
router.get("/",authMiddleware(), ferryController.getFerries);

// Get ferry by reference ID
router.get("/ref/:ref", ferryController.getFerryByReferenceId);

// Get ferry by ID
router.get("/:id", authMiddleware(), ferryController.getFerryById);


// Update ferry by ID
router.put("/:id", authMiddleware(), ferryController.updateFerryById);

// Delete ferry by ID
router.delete("/:id", authMiddleware(), ferryController.deleteFerryById);

module.exports = router;
