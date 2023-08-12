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
    favorite: Boolean,
  },
  { timestamps: true }
);
uploadSchema.virtual("thumbnail").get(function () {
  return this.path.replace("pdf", "jpg");
});

const Upload = mongoose.model("Upload", uploadSchema);
module.exports = Upload;
