const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

// Configure Cloudinary with the provided credentials
cloudinary.config({
  cloud_name: "dsy5witsn",
  api_key: "324421775347237",
  api_secret: "MNJs9YJVJY-9npLcw0chLhPo1Bs",
});

/**
 * Uploads a file to Cloudinary with cache control headers
 * @param {Object} file - The file object from multer
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<string>} - URL of the uploaded image
 */
const uploadToCloudinary = async (file, folder = "") => {
  try {
    // Upload the image to Cloudinary with cache control
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: "auto",
      // Set optimization options for better performance
      eager: [{ transformation: { quality: "auto", fetch_format: "auto" } }],
      eager_async: true,
      eager_notification_url: "",
    });

    // Delete the local file after successful upload
    fs.unlinkSync(file.path);

    // Return the secure URL of the uploaded image
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

/**
 * Deletes an image from Cloudinary by URL
 * @param {string} imageUrl - The URL of the image to delete
 * @returns {Promise<boolean>} - Success status
 */
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl || imageUrl.includes("flaticon.com")) {
      // Skip default images or empty URLs
      return true;
    }

    // Extract public ID from the Cloudinary URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return false;
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
