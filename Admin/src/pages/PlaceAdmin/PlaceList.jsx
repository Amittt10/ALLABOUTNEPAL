// admin/pages/PlaceList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PlaceList.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PlaceList() {
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get(`${API}/api/places`);
        setPlaces(res.data);
      } catch (err) {
        setMessage("Failed to load places.");
      }
    };
    fetchPlaces();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this place?")) return;
    try {
      await axios.delete(`${API}/api/places/${id}`);
      setPlaces((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setMessage("Delete failed.");
    }
  };

  return (
    <div className="place-list-container">
      <div className="header">
        <h2>All Places</h2>
        <Link to="/admin/places/add" className="add-btn">Add New Place</Link>
      </div>
      {message && <p className="message">{message}</p>}
      <div className="place-grid">
        {places.map((p) => (
          <div key={p._id} className="place-card">
            <img src={`${API}${p.thumbnail}`} alt={p.title_en} />
            <h3>{p.title_en}</h3>
            <p>Category: {p.category}</p>
            <div className="actions">
              <Link to={`/admin/places/edit/${p._id}`} className="edit-btn">Edit</Link>
              <button onClick={() => handleDelete(p._id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
