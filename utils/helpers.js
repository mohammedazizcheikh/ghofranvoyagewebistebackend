const { deleteFromCloudinary } = require("../config/cloudinary");

const extractPublicId = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop().split(".")[0]; // Extract filename without extension
  const folderName = parts.slice(-1).join("/"); // Extract folder path (including any subfolders)
  return `${folderName}/${fileName}`;
};
/**
 * Deletes an array of Cloudinary image URLs
 * @param {string[]} imageUrls - Array of Cloudinary image URLs
 * @returns {Promise<void>}
 */
async function deleteCloudinaryImages(imageUrls = []) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;
  console.log("Deleting images from Cloudinary:", imageUrls); 
  await Promise.all(
    imageUrls.map(async (url) => {
      try {
        const publicId = extractPublicId(url);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      } catch (err) {
        console.error("Failed to delete image:", url, err);
      }
    })
  );
}



module.exports = {
  extractPublicId,
  deleteCloudinaryImages,
};



//usage of delete 
// const { deleteCloudinaryImages } = require("../utils/cloudinaryHelper");

// await deleteCloudinaryImages(omra.images);
