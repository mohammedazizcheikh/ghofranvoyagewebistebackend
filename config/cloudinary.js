const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');
const { MulterError } = require('multer');
const {cloudinaryConf} = require('./config');
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: cloudinaryConf.cloudName,
  api_key: cloudinaryConf.apiKey,
  api_secret: cloudinaryConf.apiSecret,
});

// Multer configuration to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage }).array('images');

//upload a file to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    Readable.from(fileBuffer).pipe(stream);
  });
};

//delete an image from Cloudinary**
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new Error('Failed to delete image');
    }
    console.log('Image deleted from Cloudinary:', publicId);
    console.log(result);
    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return { success: false, message: 'Error deleting image', error };
  }
};

const handleImageUploads = (
  options = { folder: "uploads", maxFiles: 10, required: true }
) => {
  return async (req, res, next) => {
    try {
      // Call the Multer middleware
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      

      // Check if files are provided
      if (!req.files || req.files.length === 0) {
        if (req.method === "PUT") {
          req.cloudinaryResults = null;
          return next();
        }

        if (req.method === "POST") {
          return res
            .status(400)
            .json({ message: "No files uploaded for creation" });
        }
      }

      // Validate file count
      if (req.files.length > options.maxFiles) {
        return res.status(400).json({
          message: `You can upload a maximum of ${options.maxFiles} files.`,
        });
      }

      // Process uploaded files and upload to Cloudinary
      const uploadResults = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer, options.folder))
      );

      req.cloudinaryResults = uploadResults; // Store the results for later use
      next();
    } catch (error) {
      if (error instanceof MulterError) {
        // Handle Multer-specific errors
        return res.status(400).json({ message: "File upload error", error });
      }
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
};

module.exports = { handleImageUploads, deleteFromCloudinary };
