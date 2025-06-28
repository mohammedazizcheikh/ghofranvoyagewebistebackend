const express = require("express");
const router = express.Router();
const { tagController } = require("../controllers");
const authMiddleware = require("../middlewares/authMiddleware");


//get tags
router.get("/", tagController.getTags);

// Get tag by Id
router.get("/:id",authMiddleware(), tagController.getTagById);

// Update tag
router.put("/:id",authMiddleware() ,tagController.updateTag);

// Delete tag
router.delete("/:id",authMiddleware() ,tagController.deleteTag);

module.exports = router;
