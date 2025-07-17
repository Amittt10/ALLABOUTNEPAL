import express from "express";
import {
  getAllBlogs,
  getLatestBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { uploadBlogFiles } from "../middleware/uploadMiddleware.js";


const router = express.Router();

// Public
router.get("/", getAllBlogs);
router.get("/latest", getLatestBlogs);
router.get("/:slug", getBlogBySlug);

// Admin (protected later if needed)
router.post("/", uploadBlogFiles, createBlog);  // use uploadBlogThumbnail middleware here
router.put("/:id", uploadBlogFiles, updateBlog); // and here
router.delete("/:id", deleteBlog);

export default router;
