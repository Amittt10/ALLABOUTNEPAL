import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import festivalsData from "../data/festivalsData";
import "./FestivalDetails.css";

export default function FestivalDetailBySlug() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [festival, setFestival] = useState(null);

  useEffect(() => {
    if (slug && festivalsData[slug]) {
      setFestival(festivalsData[slug]);
    } else {
      setFestival(null);
    }
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(
      i18n.language === "ne" ? "ne-NP" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  if (!festival) {
    return (
      <div className="festival-detail-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; {t("festival.back")}
        </button>
        <p>{t("festival.notFound")}</p>
      </div>
    );
  }

  const isNepali = i18n.language === "ne";

  return (
    <div className="festival-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        &larr; {t("festival.back")}
      </button>

      <div className="festival-detail-card">
        <img
          src={festival.image}
          alt={isNepali ? festival.name_np : festival.name_en}
          className="festival-detail-image"
        />
        <h1 className="festival-detail-title">
          {isNepali ? festival.name_np : festival.name_en}
        </h1>
        <p className="festival-detail-date">{formatDate(festival.dateAD)}</p>

        <div className="festival-detail-section">
          <h3>{t("festival.description")}</h3>
          <p>{isNepali ? festival.description_np : festival.description_en}</p>
        </div>

        <div className="festival-detail-section">
          <h3>{t("festival.significance")}</h3>
          <p>{isNepali ? festival.significance_np : festival.significance_en}</p>
        </div>

        <div className="festival-detail-section">
          <h3>{t("festival.location")}</h3>
          <p>{isNepali ? festival.location_np : festival.location_en}</p>
        </div>

        <div className="festival-detail-section">
          <h3>{t("festival.category")}</h3>
          <p>{festival.category}</p>
        </div>
      </div>
    </div>
  );
}
