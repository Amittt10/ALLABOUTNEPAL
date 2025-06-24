import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Festivals.css";

export default function Festivals() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/festivals");
        setFestivals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to load festivals.");
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, []);

  if (loading) return <p>Loading festivals...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="festivals-page">
      <main className="festivals-list-section">
        <h1>Festivals</h1>
        <div className="festivals-grid">
          {festivals.map((festival) => (
            <Link
              to={`/festivals/${festival._id}`}
              className="festival-card"
              key={festival._id}
            >
              {festival.image && (
                <img
                  src={`http://localhost:3000/${festival.image}`}
                  alt={festival.name_en}
                />
              )}
              <h3>{festival.name_en}</h3>
            </Link>
          ))}
        </div>
      </main>

      <aside className="events-sidebar">
        <h2>Event Calendar</h2>
        <button onClick={() => navigate("/festivals/calendar")}>Event Calendar</button>
        <button onClick={() => navigate("/festivals/highlights")}>Festivals Highlight</button>
      </aside>
    </div>
  );
}
