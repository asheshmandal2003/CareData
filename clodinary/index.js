const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CareData",
    allowed_formats: ["jpeg", "png", "jpg", "pdf"],
  },
});

module.exports = { cloudinary, storage };
