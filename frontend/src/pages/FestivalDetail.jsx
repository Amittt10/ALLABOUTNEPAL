// src/pages/FestivalDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../api/axiosConfig";
import { useTranslation } from "react-i18next";
import "./FestivalDetails.css";

export default function FestivalDetail() {
  const { id } = useParams();
  const { i18n, t } = useTranslation();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const { data } = await axiosInstance.get(`/festivals/${id}`);
        setFestival(data);
      } catch (error) {
        console.error("Error fetching festival:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFestival();
  }, [id]);

  if (loading) return <div className="loading">Loading festival details…</div>;
  if (!festival) return <div className="error">Festival not found.</div>;

  // Language-specific content
  const title = i18n.language === "np" ? festival.name_np : festival.name_en;
  const description = i18n.language === "np" ? festival.description_np : festival.description_en;
  const significance = i18n.language === "np" ? festival.significance_np : festival.significance_en;
  const location = i18n.language === "np" ? festival.location_np : festival.location_en;

  return (
    <section className="festival-detail-container">
      <img
        src={`http://localhost:3000/${festival.image}`}
        alt={title}
        className="festival-detail-image"
      />

      <h1 className="festival-detail-title">{title}</h1>

      <div className="festival-detail-meta">
        <span className="festival-detail-date">
          📅 {festival.dateBS}{" "}
          {festival.dateAD && `(${new Date(festival.dateAD).toDateString()})`}
        </span>
        <span className="festival-detail-location">📍 {location}</span>
      </div>

      <h2 className="festival-detail-heading">{t("Description")}</h2>
      <p className="festival-detail-paragraph">{description}</p>

      <h2 className="festival-detail-heading">{t("Significance")}</h2>
      <p className="festival-detail-paragraph">{significance}</p>
    </section>
  );
}
