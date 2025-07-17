import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../../api/blogApi";
import "./BlogAdd.css";

const BlogAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    snippet: "",
    content: "",
    category: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]); // multiple gallery images

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbnail) formData.append("thumbnail", thumbnail);
    images.forEach((img) => formData.append("gallery", img)); // multiple images

    try {
      await createBlog(formData);
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Failed to add blog", err);
    }
  };

  return (
    <div className="blog-form-container">
      <h2>Add Blog</h2>
      <form
        className="blog-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Snippet</label>
        <input
          name="snippet"
          value={form.snippet}
          onChange={handleChange}
          required
        />

        <label>Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        <label>Thumbnail Image</label>
        <input
          type="file"
          onChange={handleThumbnailChange}
          accept="image/*"
        />

        <label>Gallery Images (multiple)</label>
        <input
          type="file"
          onChange={handleImagesChange}
          multiple
          accept="image/*"
        />

        <button type="submit">Add Blog</button>
      </form>
    </div>
  );
};

export default BlogAdd;
