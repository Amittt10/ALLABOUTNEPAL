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

  const isNepali = i18n.language === "ne";

  useEffect(() => {
    const fetchDynamicFestivals = async () => {
      try {
        const { data } = await axiosInstance.get("/festivals");
        setDynamicFestivals(data);
      } catch (error) {
        console.error("Error fetching dynamic festivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicFestivals();
  }, []);

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

        {loading ? (
          <p>{t("loading")}</p>
        ) : dynamicFestivals.length === 0 ? (
          <p>{t("festivals.noDynamicFestivals")}</p>
        ) : (
          <ul className="festivals-list">
            {dynamicFestivals.map((festival) => (
              <li key={festival._id} className="festival-item">
                <Link to={`/festivals/dynamic/${festival._id}`}>
                  {isNepali ? festival.name_np : festival.name_en}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
