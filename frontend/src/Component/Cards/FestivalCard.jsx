import React from "react";
import { useNavigate } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "./FestivalCard.css";

export default function FestivalCard({ festival, getFullImageUrl, i18n }) {
  const { ref, visible } = useScrollAnimation();
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      i18n.language === "np" ? "ne-NP" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    );
  };

  return (
    <div
      ref={ref}
      className={`festival-card-simple fade-in-section ${visible ? "fade-in-visible" : ""}`}
      onClick={() => navigate(`/festival-detail/${festival.slug}`)}
    >
      <img
        src={getFullImageUrl(festival.image, "festival")}
        alt={i18n.language === "np" ? festival.name_np : festival.name_en}
        loading="lazy"
        className="festival-image"
      />
      <p className="festival-card-date">{formatDate(festival.dateAD)}</p>
      <h3 className="festival-title">
        {i18n.language === "np" ? festival.name_np : festival.name_en}
      </h3>
    </div>
  );
}
