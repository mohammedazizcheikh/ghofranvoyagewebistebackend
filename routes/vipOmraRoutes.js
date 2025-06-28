const express = require("express");
const router = express.Router();
const {vipOmraController} = require("../controllers");
const authMiddleware = require("../middlewares/authMiddleware");

// Public route
router.post("/request", vipOmraController.createVipOmra);
router.get("/ref/:ref", vipOmraController.getVipOmraByReferenceId);

// Admin/Agent routes
router.get("/", authMiddleware(), vipOmraController.getAllVipOmra);
router.get("/:id", authMiddleware(), vipOmraController.getVipOmraById);
router.put("/:id", authMiddleware(), vipOmraController.updateVipOmra);
router.delete("/:id", authMiddleware(), vipOmraController.deleteVipOmra);


module.exports = router;