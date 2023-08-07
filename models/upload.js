const mongoose = require("mongoose");
const { Schema } = mongoose;

const uploadSchema = new Schema(
  {
    path: String,
    filename: String,
    originalname: String,
    size: Number,
  },
  { timestamps: true }
);

const Upload = mongoose.model("Upload", uploadSchema);
module.exports = Upload;
