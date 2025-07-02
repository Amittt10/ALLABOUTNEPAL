// admin/pages/PlaceEdit.jsx
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
        <input
          type="text"
          name="title_en"
          value={form.title_en}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title_np"
          value={form.title_np}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="video_url"
          value={form.video_url}
          onChange={handleChange}
        />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="unesco">UNESCO</option>
          <option value="province">Province</option>
          <option value="pilgrims">Pilgrims</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        <textarea
          name="description_en"
          value={form.description_en}
          onChange={handleChange}
          rows={3}
        />
        <textarea
          name="description_np"
          value={form.description_np}
          onChange={handleChange}
          rows={3}
        />

        <input
          type="number"
          name="lat"
          value={form.lat}
          onChange={handleChange}
          step="any"
          required
        />
        <input
          type="number"
          name="lng"
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
