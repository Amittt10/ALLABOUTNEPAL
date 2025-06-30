// src/pages/Festivals.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../api/axiosConfig";
import festivalsData from "../data/festivalsData";
import "./Festivals.css";

export default function Festivals() {
  const { i18n, t } = useTranslation();
  const [dynamicFestivals, setDynamicFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Adjust this based on your i18n config language code for Nepali
  const isNepali = i18n.language === "ne" || i18n.language === "np" || i18n.language.startsWith("ne");

  useEffect(() => {
    const fetchDynamicFestivals = async () => {
      try {
        const { data } = await axiosInstance.get("/festivals");
        setDynamicFestivals(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dynamic festivals:", err);
        setError(t("festivals.fetchError") || "Failed to fetch dynamic festivals.");
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicFestivals();
  }, [t]);

  return (
    <div className="festivals-page">
      <h1>{t("festivals.title")}</h1>

      {/* Static Festivals Section */}
      <section className="festivals-section">
        <h2>{t("festivals.staticFestivals")}</h2>
        <ul className="festivals-list">
          {Object.values(festivalsData).map((festival) => (
            <li key={festival.slug} className="festival-item">
              <Link to={`/festivals/static/${festival.slug}`}>
                {isNepali ? festival.name_np : festival.name_en}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Dynamic Festivals Section */}
      <section className="festivals-section">
        <h2>{t("festivals.dynamicFestivals")}</h2>

        {loading && <p>{t("loading") || "Loading..."}</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && dynamicFestivals.length === 0 && (
          <p>{t("festivals.noDynamicFestivals") || "No dynamic festivals found."}</p>
        )}

        {!loading && !error && dynamicFestivals.length > 0 && (
          <ul className="festivals-list">
            {dynamicFestivals.map((festival) => (
              <li key={festival._id} className="festival-item">
                <Link to={`/festivals/dynamic/${festival._id}`}>
                  {/* Thumbnail image */}
                  <img
                    src={
                      festival.image
                        ? `http://localhost:3000/uploads/${festival.image}`
                        : "/default-festival.jpg"
                    }
                    alt={isNepali ? festival.name_np : festival.name_en}
                    className="festival-list-thumbnail"
                  />
                  <span>{isNepali ? festival.name_np : festival.name_en}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
