// admin/pages/PlaceAdd.jsx
import React, { useState } from "react";
import axios from "axios";
import "./PlaceAdd.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PlaceAdd() {
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
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => data.append(key, val));
    if (thumbnail) data.append("thumbnail", thumbnail);
    if (videoFile) data.append("video", videoFile);
    images.forEach((img) => data.append("images", img));

    try {
      await axios.post(`${API}/api/places`, data);
      setMessage("Place created successfully!");
      // Reset form if you want:
      setForm({
        title_en: "",
        title_np: "",
        category: "unesco",
        lat: "",
        lng: "",
        video_url: "",
        description_en: "",
        description_np: "",
      });
      setThumbnail(null);
      setVideoFile(null);
      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create place.");
    }
  };

  return (
    <div className="place-form-container">
      <h2>Add New Place</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="place-form">
        <input
          type="text"
          name="title_en"
          placeholder="Title (EN)"
          value={form.title_en}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title_np"
          placeholder="Title (NP)"
          value={form.title_np}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="video_url"
          placeholder="Video URL (optional)"
          value={form.video_url}
          onChange={handleChange}
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="unesco">UNESCO</option>
          <option value="province">Province</option>
          <option value="pilgrims">Pilgrims</option>
        </select>

        <label>Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <label>Video File (optional)</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />

        <label>Gallery Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        <textarea
          name="description_en"
          placeholder="Description (EN)"
          value={form.description_en}
          onChange={handleChange}
          rows={3}
        />
        <textarea
          name="description_np"
          placeholder="Description (NP)"
          value={form.description_np}
          onChange={handleChange}
          rows={3}
        />

        <input
          type="number"
          name="lat"
          step="any"
          placeholder="Latitude"
          value={form.lat}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="lng"
          step="any"
          placeholder="Longitude"
          value={form.lng}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Place</button>
      </form>
    </div>
  );
}
