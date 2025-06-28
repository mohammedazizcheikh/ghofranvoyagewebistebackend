const express = require("express");
const router = express.Router();
const {transferController} = require("../controllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Public route
router.post("/request", transferController.createTransfer);

// Admin/Agent routes
router.get("/", authMiddleware(), transferController.getAllTransfers);
router.get("/:id", authMiddleware(), transferController.getTransferById);
router.put("/:id", authMiddleware(), transferController.updateTransfer);
router.delete("/:id", authMiddleware(), transferController.deleteTransfer);
// Get transfer by reference ID
router.get(
  "/ref/:ref",
  transferController.getTransferByReferenceId
);
module.exports = router;