import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./FestivalsHighlight.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function FestivalsHighlight() {
  const { t, i18n } = useTranslation();
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleCardClick = (id) => {
    navigate(`/festival-detail/${id}`);
  };

  if (loading) return <div className="loading">{t("loading")}...</div>;
  if (error) return <div className="error">{t(error)}</div>;

  return (
    <div className="festivals-highlight-container">
      <h1 className="page-title">{t("Festivals and Events")}</h1>
      <div className="festivals-grid">
        {festivals.map((festival) => (
          <div
            key={festival._id}
            className="festival-card"
            onClick={() => handleCardClick(festival._id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === "Enter" && handleCardClick(festival._id)}
          >
            <img
              className="festival-image"
              src={festival.image ? `${API_BASE_URL.replace("/api", "")}/${festival.image}` : "/default-festival.jpg"}
              alt={i18n.language === "np" ? festival.name_np : festival.name_en}
              loading="lazy"
            />
            <div className="festival-info">
              <h2 className="festival-name">
                {i18n.language === "np" ? festival.name_np : festival.name_en}
              </h2>
              <p className="festival-date">{festival.dateBS || ""}</p>
              <p className="festival-desc">
                {(i18n.language === "np" ? festival.description_np : festival.description_en)?.slice(0, 100)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
