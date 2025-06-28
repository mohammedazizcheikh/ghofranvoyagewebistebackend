const express = require("express");
const router = express.Router();
const { handleImageUploads } = require("../config/cloudinary");
const { omraController } = require("../controllers/");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware(),
  handleImageUploads({ folder: "omra", maxFiles: 5 }), // Apply image upload middleware
  omraController.createOmra
);
router.get("/", authMiddleware(), omraController.getAllOmras);
router.get("/type/:type", omraController.getOmraByType);

router.get("/:id", omraController.getOmra);

router.put(
  "/:id",
  authMiddleware(),
  handleImageUploads({ folder: "omra", maxFiles: 5 }), // Apply image upload middleware
  omraController.updateOmra
);

router.delete("/:id", authMiddleware(), omraController.deleteOmra);
// get omra by type
module.exports = router;
