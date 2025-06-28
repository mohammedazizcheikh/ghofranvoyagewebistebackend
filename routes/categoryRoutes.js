const express = require("express");
const router = express.Router();
const { categoryController } = require("../controllers");
const authMiddleware = require("../middlewares/authMiddleware");
// Middleware to protect routes

//get categories
router.get("/", categoryController.getCategories);

// Get Category by Id
router.get("/:id", categoryController.getCategoryById);

// Update Category
router.put("/:id",
    authMiddleware(), categoryController.updateCategory);

// Delete Category
router.delete("/:id", authMiddleware(), categoryController.deleteCategory);

module.exports = router;
