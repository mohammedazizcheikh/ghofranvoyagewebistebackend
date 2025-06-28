const express = require("express");
const router = express.Router();
const { handleImageUploads } = require("../config/cloudinary");
const { tripController } = require("../controllers/");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware(),
  handleImageUploads({ folder: "trips", maxFiles: 5 }),
  tripController.createTrip
);
router.get("/type/:type", tripController.getTripByType);

router.get("/:id", tripController.getTrip);

router.get("/", tripController.getAllTrips);

router.put(
  "/:id",
  // handleImageUploads({ folder: "trips", maxFiles: 5 }),
  tripController.updateTrip
);

// Route to delete a trip by ID
router.delete("/:id", tripController.deleteTrip);

module.exports = router;
