import React from "react";
import { Link } from "react-router-dom";
import useScrollAnimation from "../../hooks/useScrollAnimation";

export default function PlaceCard({ place, getFullImageUrl, i18n, onClick }) {
  const { ref, visible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`place-card fade-in-section ${visible ? "fade-in-visible" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      <img
        src={getFullImageUrl(place.thumbnail)}
        alt={i18n.language === "np" ? place.title_np : place.title_en}
        className="place-thumbnail"
        loading="lazy"
      />
      <h2>{i18n.language === "np" ? place.title_np : place.title_en}</h2>
    </div>
  );
}
