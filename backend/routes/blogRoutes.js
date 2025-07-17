import express from "express";
import {
  getAllBlogs,
  getLatestBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategories,
} from "../controllers/blogController.js";
import { uploadBlogFiles } from "../middleware/uploadMiddleware.js";


const router = express.Router();

// Public
router.get("/", getAllBlogs);
router.get("/latest", getLatestBlogs);
router.get("/:slug", getBlogBySlug);

// Get blog categories
router.get("/categories", getBlogCategories);

// Admin (protected later if needed)
router.post("/", uploadBlogFiles, createBlog);  // use uploadBlogThumbnail middleware here
router.put("/:id", uploadBlogFiles, updateBlog); // and here
router.delete("/:id", deleteBlog);

export default router;
