import axios from "./axiosConfig";

// Get all blogs
export const fetchBlogs = () => axios.get("/blogs");

// Get blog by slug
export const fetchBlogBySlug = (slug) => axios.get(`/blogs/${slug}`);

// Create a new blog
export const createBlog = (formData) =>
  axios.post("/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Update a blog
export const updateBlog = (id, formData) =>
  axios.put(`/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete a blog
export const deleteBlog = (id) => axios.delete(`/blogs/${id}`);
