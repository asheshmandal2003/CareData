const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, trim: true, required: true },
    content: { type: String, required: true }, 
    image: { type: String, trim: true }, 
    category: { type: String, trim: true, default: "General" },
    author: { type: String, trim: true, default: "Admin" },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
