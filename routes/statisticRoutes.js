const express = require("express");
const router = express.Router();
const { statisticsController } = require("../controllers/");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/overview",authMiddleware(), statisticsController.getDashboardOverview);
router.get("/total",authMiddleware(), statisticsController.getTotalStatistics);


module.exports = router;
