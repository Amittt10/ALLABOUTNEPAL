import Blog from "../models/Blog.js";
import slugify from "slugify";

// @desc Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error in getAllBlogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// @desc Get latest blogs with optional limit (e.g., ?limit=3)
export const getLatestBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(limit);
    res.json(blogs);
  } catch (err) {
    console.error("Error in getLatestBlogs:", err);
    res.status(500).json({ message: "Failed to fetch latest blogs" });
  }
};

// @desc Get a blog by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    console.error("Error in getBlogBySlug:", err);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

// @desc Create a new blog with optional thumbnail & gallery
export const createBlog = async (req, res) => {
  try {
    const { title, snippet, content, category } = req.body;
    const slug = slugify(title, { lower: true });

    const thumbnailFile = req?.files?.thumbnail?.[0];
    const galleryFiles = req?.files?.gallery || [];

    const thumbnail = thumbnailFile ? `/uploads/blogs/${thumbnailFile.filename}` : null;
    const gallery = galleryFiles.map(file => `/uploads/blogs/${file.filename}`);

    const newBlog = new Blog({
      title,
      snippet,
      content,
      category,
      slug,
      thumbnail,
      gallery,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("Error in createBlog:", err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

// @desc Update blog (replace thumbnail/gallery if provided)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, snippet, content, category } = req.body;

    blog.title = title || blog.title;
    blog.snippet = snippet || blog.snippet;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.slug = slugify(blog.title, { lower: true });

    // Update thumbnail if uploaded
    const thumbnailFile = req?.files?.thumbnail?.[0];
    if (thumbnailFile) {
      blog.thumbnail = `/uploads/blogs/${thumbnailFile.filename}`;
    }

    // Replace gallery if new files uploaded
    const galleryFiles = req?.files?.gallery;
    if (galleryFiles && galleryFiles.length > 0) {
      blog.gallery = galleryFiles.map(file => `/uploads/blogs/${file.filename}`);
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error("Error in updateBlog:", err);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

// @desc Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error in deleteBlog:", err);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};
