const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
cloudinary.image("single_page_pdf", { format: "jpg" });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CareData",
    allowedFormats: ["jpeg", "png", "jpg", "pdf"],
  },
});

module.exports = { cloudinary, storage };
