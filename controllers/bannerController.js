const { Banner } = require("../models");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { extractPublicId } = require("../utils/helpers");
const { deleteFromCloudinary } = require("../config/cloudinary");

// Create a banner
exports.createBanner = async (req, res) => {
  try {
    console.log("creating banner");
    const { title, subTitle, link } = req.body;
    if (!title || !subTitle) {
      return sendErrorResponse(res, "Missing required fields", 400);
    }

    let imageUrl = "";
    if (req.cloudinaryResults && req.cloudinaryResults.length > 0) {
      imageUrl = req.cloudinaryResults[0].secure_url;
    }

    const newBanner = new Banner({
      title,
      subTitle,
      image: imageUrl,
      link,
    });

    await newBanner.save();

    sendSuccessResponse(res, newBanner);
  } catch (error) {
    sendErrorResponse(res, "Error creating banner", 400, {
      error: error.message,
    });
  }
};

// Update a banner by ID
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subTitle, link, isActive } = req.body;
    const updates = { title, subTitle, link, isActive };

    if (req.cloudinaryResults && req.cloudinaryResults.length > 0) {
      updates.image = req.cloudinaryResults[0].secure_url;
    }

    console.log(updates);

    const banner = await Banner.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!banner) {
      return sendErrorResponse(res, "Banner not found", 404);
    }

    sendSuccessResponse(res, banner);
  } catch (error) {
    sendErrorResponse(res, "Error updating banner", 400, {
      error: error.message,
    });
  }
};

// Get a banner by ID
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return sendErrorResponse(res, "Banner not found", 404);
    }

    sendSuccessResponse(res, banner);
  } catch (error) {
    sendErrorResponse(res, "Error fetching banner", 400, {
      error: error.message,
    });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    sendSuccessResponse(res, banners);
  } catch (error) {
    sendErrorResponse(res, "Error fetching banners", 400, {
      error: error.message,
    });
  }
};
// Get active banner
exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    sendSuccessResponse(res, banners);
  } catch (error) {
    sendErrorResponse(res, "Error fetching banners", 400, {
      error: error.message,
    });
  }
};

// Delete a banner by ID
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return sendErrorResponse(res, "Banner not found", 404);
    }

    if (banner.imageUrl) {
      const publicId = extractPublicId(banner.imageUrl);
      await deleteFromCloudinary(publicId);
    }

    await Banner.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, {
      message: "Banner deleted successfully",
    });
  } catch (error) {
    sendErrorResponse(res, "Error deleting banner", 400, {
      error: error.message,
    });
  }
};
