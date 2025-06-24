import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import festivalsData from "../data/festivalsData";
import "./FestivalDetails.css";

export default function FestivalDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [festival, setFestival] = useState(null);

  useEffect(() => {
    // Load festival data from static festivalsData.js by slug
    if (slug && festivalsData[slug]) {
      setFestival(festivalsData[slug]);
    } else {
      setFestival(null);
    }
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!festival) {
    return (
      <div className="festival-detail-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <p>Festival not found.</p>
      </div>
    );
  }

  return (
    <div className="festival-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="festival-detail-card">
        <img
          src={festival.image}
          alt={festival.name_en}
          className="festival-detail-image"
        />
        <h1 className="festival-detail-title">{festival.name_en}</h1>
        <p className="festival-detail-date">{formatDate(festival.dateAD)}</p>

        <div className="festival-detail-section">
          <h3>Description</h3>
          <p>{festival.description_en}</p>
        </div>

        <div className="festival-detail-section">
          <h3>Significance</h3>
          <p>{festival.significance_en}</p>
        </div>

        <div className="festival-detail-section">
          <h3>Location</h3>
          <p>{festival.location_en}</p>
        </div>

        <div className="festival-detail-section">
          <h3>Category</h3>
          <p>{festival.category}</p>
        </div>
      </div>
    </div>
  );
}
