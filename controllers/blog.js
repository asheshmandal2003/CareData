const Blog = require("../models/blog");
const cheerio = require("cheerio");

// List all blogs
module.exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).sort({ publishedAt: -1 });
    res.render("blog/blogs", { blogs, page: "blogs" });
  } catch (e) {
    next(e);
  }
};

module.exports.getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }

    // Prepare Table of Contents (TOC)
    const $ = cheerio.load(blog.content || "");
    const toc = [];
    $("h2, h3").each((i, el) => {
      const tag = el.tagName.toLowerCase();
      let text = $(el).text();
      let id = text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-|-$/g, "");
      if ($('[id="' + id + '"]').length > 0) id = id + "-" + i;
      $(el).attr("id", id);
      toc.push({ text, id, tag });
    });
    const preparedContent = $.html();

    // Pass toc and content with injected IDs to the template
    res.render("blog/show", { blog, page: "blogs", toc, preparedContent });
  } catch (e) {
    next(e);
  }
};

// (Optional) Create/seed blog route for admin/testing
module.exports.renderNewBlogForm = (req, res) => {
  res.render("blog/new");
};

module.exports.createBlog = async (req, res, next) => {
  try {
    const { title, summary, content, image, category, author } = req.body;
    const blog = new Blog({ title, summary, content, image, category, author });
    await blog.save();
    req.flash("success", "Blog post created!");
    res.redirect("/blogs");
  } catch (e) {
    next(e);
  }
};
