// routes/static.js
const express = require("express");
const {
  syncCities,
  syncTags,
  syncCategory,
} = require("../../controllers/partnerAPI/staticSync");
const router = express.Router();

const asyncHandler = (fn) => (req, res) =>
  fn(req, res).catch((err) =>
    res.status(500).json({ success: false, error: err.message })
  );

router.post(
  "/sync/city",
  asyncHandler(async (req, res) => {
    await syncCities();
    res.json({ success: true });
  })
);

router.post(
  "/sync/tag",
  asyncHandler(async (req, res) => {
    await syncTags();
    res.json({ success: true });
  })
);
router.post(
  "/sync/category",
  asyncHandler(async (req, res) => {
    await syncCategory();
    res.json({ success: true });
  })
);

module.exports = router;
