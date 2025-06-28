const { Tag } = require("../models");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");

// Get Tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    sendSuccessResponse(res, tags);
  } catch (error) {
    sendErrorResponse(res, "Error fetching tags", 500, {
      error: error.message,
    });
  }
};

// Get Tag by Id
exports.getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findById(id);
    if (!tag) {
      return sendErrorResponse(res, "Tag not found", 404);
    }
    sendSuccessResponse(res, tag);
  } catch (error) {
    sendErrorResponse(res, "Error fetching tag", 500, {
      error: error.message,
    });
  }
};

// Update Tag
exports.updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const tag = await Tag.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return sendErrorResponse(res, "Tag not found", 404);
    }

    sendSuccessResponse(res, tag);
  } catch (error) {
    sendErrorResponse(res, "Error updating tag", 400, {
      error: error.message,
    });
  }
};

// Delete Tag
exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return sendErrorResponse(res, "Tag not found", 404);
    }

    sendSuccessResponse(res, { message: "Tag deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, "Error deleting tag", 500, {
      error: error.message,
    });
  }
};
