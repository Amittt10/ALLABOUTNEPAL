import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBlogBySlug, updateBlog } from "../../api/blogApi";
import "./BlogEdit.css";

const BlogEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    snippet: "",
    content: "",
    category: "",
  });
  const [blogId, setBlogId] = useState(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]); // new images to add

  // Existing images from backend
  const [existingImages, setExistingImages] = useState([]);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const { data } = await fetchBlogBySlug(slug);
        setForm({
          title: data.title,
          snippet: data.snippet,
          content: data.content,
          category: data.category,
        });
        setBlogId(data._id);
        setExistingThumbnail(data.thumbnail || null);
        setExistingImages(data.gallery || []); // Note: field name 'gallery'
      } catch (err) {
        console.error("Failed to load blog", err);
      }
    };
    loadBlog();
  }, [slug]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const removeExistingImage = (filename) => {
    setExistingImages(existingImages.filter((img) => img !== filename));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbnail) formData.append("thumbnail", thumbnail);

    images.forEach((img) => formData.append("gallery", img));

    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      await updateBlog(blogId, formData);
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Failed to update blog", err);
    }
  };

  return (
    <div className="blog-edit-container">
      <h2>Edit Blog</h2>
      <form
        className="blog-edit-form"
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

        <label>Current Thumbnail</label>
        {existingThumbnail ? (
          <img
            src={existingThumbnail}
            alt="Current thumbnail"
            className="thumbnail-preview"
          />
        ) : (
          <p>No thumbnail yet</p>
        )}

        <label>Change Thumbnail</label>
        <input
          type="file"
          onChange={handleThumbnailChange}
          accept="image/*"
        />

        <label>Current Gallery Images</label>
        <div className="gallery-preview">
          {existingImages.length > 0 ? (
            existingImages.map((img, i) => (
              <div key={i} className="gallery-image-container">
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="gallery-image"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeExistingImage(img)}
                >
                  ✖
                </button>
              </div>
            ))
          ) : (
            <p>No gallery images</p>
          )}
        </div>

        <label>Add More Gallery Images</label>
        <input
          type="file"
          multiple
          onChange={handleImagesChange}
          accept="image/*"
        />

        <button type="submit">Update Blog</button>
      </form>
    </div>
  );
};

export default BlogEdit;
