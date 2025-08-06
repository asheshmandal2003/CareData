const express = require("express");
const router = express.Router();
const blog = require("../controllers/blog");

// List all blogs
router.get("/", blog.getAllBlogs);

// New blog (optional/admin only)
// router.get("/new", blog.renderNewBlogForm);
// router.post("/", blog.createBlog);

// Single blog display
router.get("/:id", blog.getBlogById);

module.exports = router;
