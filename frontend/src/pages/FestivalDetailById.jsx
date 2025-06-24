import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./FestivalDetails.css";

export default function FestivalDetailById() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:3000/api/festivals/${id}`);
        setFestival(response.data);
      } catch (err) {
        setError("Failed to load festival details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFestival();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === "np" ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p>Loading festival details...</p>;
  if (error)
    return (
      <div className="festival-detail-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <p className="error">{error}</p>
      </div>
    );

  if (!festival)
    return (
      <div className="festival-detail-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <p>Festival not found.</p>
      </div>
    );

  // Decide fields based on language
  const isNepali = i18n.language === "np";

  return (
    <div className="festival-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="festival-detail-card">
        <img
          src={festival.image ? `http://localhost:3000/${festival.image}` : "/default-festival.jpg"}
          alt={isNepali ? festival.name_np : festival.name_en}
          className="festival-detail-image"
        />
        <h1 className="festival-detail-title">{isNepali ? festival.name_np : festival.name_en}</h1>
        <p className="festival-detail-date">{formatDate(festival.dateAD)}</p>

        <section className="festival-detail-section">
          <h3>{isNepali ? "वर्णन" : "Description"}</h3>
          <p>{isNepali ? festival.description_np : festival.description_en || "No description available."}</p>
        </section>

        <section className="festival-detail-section">
          <h3>{isNepali ? "महत्व" : "Significance"}</h3>
          <p>{isNepali ? festival.significance_np : festival.significance_en || "No significance information available."}</p>
        </section>

        <section className="festival-detail-section">
          <h3>{isNepali ? "स्थान" : "Location"}</h3>
          <p>{isNepali ? festival.location_np : festival.location_en || "Location info not available."}</p>
        </section>

        <section className="festival-detail-section">
          <h3>{isNepali ? "श्रेणी" : "Category"}</h3>
          <p>{festival.category || "N/A"}</p>
        </section>
      </div>
    </div>
  );
}
