import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./FestivalsHighlight.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function FestivalsHighlight() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const response = await axios.get(`${API_BASE_URL}/festivals`);
        if (Array.isArray(response.data)) {
          setFestivals(response.data);
        } else {
          setError("Invalid data format from server");
        }
      } catch (err) {
        setError("Failed to fetch festivals");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFestivals();
  }, []);

  const handleClick = (id) => navigate(`/festival-detail/${id}`);

  if (loading) return <div className="loading">{t("loading")}...</div>;
  if (error) return <div className="error">{error}</div>;

  // Decide size classes depending on screen width
  const isMobile = window.innerWidth <= 768;
  const sizeClasses = isMobile ? ["small"] : ["small", "tall", "wide"];

  return (
    <div className="festivals-highlight-container">
      <h1 className="page-title">{t("Festivals and Events")}</h1>
      <div className="masonry">
        {festivals.map((festival, index) => {
          // Every 7th tile is big on larger screens
          const sizeClass =
            index % 7 === 0 && !isMobile
              ? "big"
              : sizeClasses[Math.floor(Math.random() * sizeClasses.length)];

          return (
            <div
              key={festival._id}
              className={`masonry-item ${sizeClass}`}
              onClick={() => handleClick(festival._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleClick(festival._id)}
              aria-label={`View details for ${
                i18n.language === "np" ? festival.name_np : festival.name_en
              }`}
            >
              <img
                className="masonry-image"
                src={
                  festival.image
                    ? `${API_BASE_URL.replace("/api", "")}/${festival.image}`
                    : "/default-festival.jpg"
                }
                alt={i18n.language === "np" ? festival.name_np : festival.name_en}
                loading="lazy"
                onLoad={(e) => e.currentTarget.setAttribute("loaded", "true")}
              />
              <div className="masonry-overlay">
                <h2>{i18n.language === "np" ? festival.name_np : festival.name_en}</h2>
                <span>{festival.dateBS || ""}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
