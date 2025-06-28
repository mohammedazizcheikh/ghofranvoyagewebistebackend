// categoryController.js
const { Category } = require("../models");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

// Get Category
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    sendSuccessResponse(res, categories);
  } catch (error) {
    sendErrorResponse(res, "Error fetching categories", 500, {
      error: error.message,
    });
  }
};

// Get Category by Id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return sendErrorResponse(res, "Category not found", 404);
    }
    sendSuccessResponse(res, category);
  } catch (error) {
    sendErrorResponse(res, "Error fetching category", 500, {
      error: error.message,
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Title,
    } = req.body;
    const updateData = {
      Title,
    };
    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return sendErrorResponse(res, "Category not found", 404);
    }

    sendSuccessResponse(res,  category );
  } catch (error) {
    sendErrorResponse(res, "Error updating category", 400, {
      error: error.message,
    });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return sendErrorResponse(res, "Category not found", 404);
    }

    sendSuccessResponse(res, { message: "Category deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, "Error deleting category", 500, {
      error: error.message,
    });
  }
};
