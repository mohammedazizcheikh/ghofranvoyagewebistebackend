const express = require("express");
const router = express.Router();
const { cityController } = require("../controllers");
const authMiddleware = require("../middlewares/authMiddleware");


//get cities
router.get("/", cityController.getCities);

// Get City by Id
router.get("/:id", cityController.getCityById);

// Update City
router.put("/:id", authMiddleware(), cityController.updateCity);

// Delete City
router.delete("/:id", authMiddleware(), cityController.deleteCity);

module.exports = router;
