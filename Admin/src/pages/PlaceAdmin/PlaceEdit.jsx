import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PlaceForm.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PlaceEdit() {
  const { id } = useParams();
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
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`${API}/api/places/${id}`);
        const place = res.data;
        setForm({
          ...form,
          ...place,
          lat: place.location.lat,
          lng: place.location.lng,
        });
      } catch (err) {
        setMessage("Failed to fetch place.");
      }
    };
    fetchPlace();
  }, [id]);

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
      await axios.put(`${API}/api/places/${id}`, data);
      navigate("/admin/places");
    } catch (err) {
      setMessage("Failed to update.");
    }
  };

  return (
    <div className="place-form-container">
      <h2>Edit Place</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="place-form">
        <label htmlFor="title_en">Title (English)</label>
        <input
          type="text"
          name="title_en"
          id="title_en"
          value={form.title_en}
          onChange={handleChange}
          required
        />

        <label htmlFor="title_np">Title (Nepali)</label>
        <input
          type="text"
          name="title_np"
          id="title_np"
          value={form.title_np}
          onChange={handleChange}
          required
        />

        <label htmlFor="video_url">Video URL (YouTube or other)</label>
        <input
          type="text"
          name="video_url"
          id="video_url"
          value={form.video_url}
          onChange={handleChange}
        />

        <label htmlFor="category">Category</label>
        <select name="category" id="category" value={form.category} onChange={handleChange}>
          <option value="unesco">UNESCO</option>
          <option value="province">Province</option>
          <option value="pilgrims">Pilgrims</option>
        </select>

        <label htmlFor="thumbnail">Thumbnail Image</label>
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />

        <label htmlFor="videoFile">Upload Video File</label>
        <input
          type="file"
          id="videoFile"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />

        <label htmlFor="images">Gallery Images</label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        <label htmlFor="description_en">Description (English)</label>
        <textarea
          name="description_en"
          id="description_en"
          value={form.description_en}
          onChange={handleChange}
          rows={3}
        />

        <label htmlFor="description_np">Description (Nepali)</label>
        <textarea
          name="description_np"
          id="description_np"
          value={form.description_np}
          onChange={handleChange}
          rows={3}
        />

        <label htmlFor="lat">Latitude</label>
        <input
          type="number"
          name="lat"
          id="lat"
          value={form.lat}
          onChange={handleChange}
          step="any"
          required
        />

        <label htmlFor="lng">Longitude</label>
        <input
          type="number"
          name="lng"
          id="lng"
          value={form.lng}
          onChange={handleChange}
          step="any"
          required
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
