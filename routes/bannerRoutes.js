const express = require("express");
const router = express.Router();
const { handleImageUploads } = require("../config/cloudinary");
const { bannerController } = require("../controllers");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/",
  authMiddleware(),
  handleImageUploads({ folder: "banners", maxFiles: 1 }),
  bannerController.createBanner
);

router.get("/", authMiddleware(), bannerController.getAllBanners);

router.get("/user/active", bannerController.getActiveBanners);

router.get("/:id", authMiddleware(), bannerController.getBanner);

router.put(
  "/:id",
  authMiddleware(),
  handleImageUploads({ folder: "banners", maxFiles: 1 }),
  bannerController.updateBanner
);

router.delete("/:id", authMiddleware(), bannerController.deleteBanner);

module.exports = router;
