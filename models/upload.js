const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");

const uploadSchema = new Schema(
  {
    path: String,
    filename: String,
    originalname: String,
    size: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Upload = mongoose.model("Upload", uploadSchema);
module.exports = Upload;
