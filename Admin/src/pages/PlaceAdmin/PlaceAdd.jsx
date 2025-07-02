import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PlaceAdd.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PlaceAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title_en: "",
    title_np: "",
    category: "unesco",
    lat: "",
    lng: "",
    video_url: "",
    description_en: "",
    description_np: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      if (name === "images") {
        // Multiple gallery images
        setImages(Array.from(files));
      } else if (name === "thumbnail") {
        // Single thumbnail image
        setThumbnail(files[0]);
      } else if (name === "videoFile") {
        // Single video file
        setVideoFile(files[0]);
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!form.title_en || !form.title_np || !form.lat || !form.lng) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      // Append text fields
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== "") {
          data.append(key, val);
        }
      });

      // Append files
      if (thumbnail) data.append("thumbnail", thumbnail);
      if (videoFile) data.append("video", videoFile);
      images.forEach((img) => data.append("images", img));

      await axios.post(`${API}/api/places`, data);

      setLoading(false);
      navigate("/admin/places"); // redirect after success
    } catch (err) {
      console.error(err);
      setError("Failed to create place.");
      setLoading(false);
    }
  };

  return (
    <div className="place-form-container">
      <h2>Add New Place</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="place-form">
        <label>Title (EN)*</label>
        <input
          type="text"
          name="title_en"
          value={form.title_en}
          onChange={handleChange}
          required
        />

        <label>Title (NP)*</label>
        <input
          type="text"
          name="title_np"
          value={form.title_np}
          onChange={handleChange}
          required
        />

        <label>Video URL (optional)</label>
        <input
          type="text"
          name="video_url"
          value={form.video_url}
          onChange={handleChange}
          placeholder="http://example.com/video.mp4"
        />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="unesco">UNESCO</option>
          <option value="province">Province</option>
          <option value="pilgrims">Pilgrims</option>
        </select>

        <label>Thumbnail Image</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleChange}
        />

        <label>Video File (optional)</label>
        <input
          type="file"
          name="videoFile"
          accept="video/*"
          onChange={handleChange}
        />

        <label>Gallery Images (multiple)</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
        />

        <label>Description (EN)</label>
        <textarea
          name="description_en"
          value={form.description_en}
          onChange={handleChange}
          rows={4}
        />

        <label>Description (NP)</label>
        <textarea
          name="description_np"
          value={form.description_np}
          onChange={handleChange}
          rows={4}
        />

        <label>Latitude*</label>
        <input
          type="number"
          name="lat"
          value={form.lat}
          onChange={handleChange}
          step="any"
          required
        />

        <label>Longitude*</label>
        <input
          type="number"
          name="lng"
          value={form.lng}
          onChange={handleChange}
          step="any"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Place"}
        </button>
      </form>
    </div>
  );
}
