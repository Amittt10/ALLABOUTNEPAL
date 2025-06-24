import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./FestivalCalendar.css"; // updated CSS below

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function FestivalCalendar() {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE_URL}/api/festivals`);
        setFestivals(res.data);
      } catch {
        setError(t("festival.failedLoadFestivals"));
      } finally {
        setLoading(false);
      }
    };
    fetchFestivals();
  }, [t]);

  const today = new Date();
  const upcomingFestivals = festivals
    .filter((f) => f.dateAD && new Date(f.dateAD) >= today)
    .sort((a, b) => new Date(a.dateAD) - new Date(b.dateAD));

  const formatDateShort = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(i18n.language === "np" ? "ne-NP" : "en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const handleFestivalClick = (id) => {
    navigate(`/festival-detail/${id}`);
  };

  if (loading) return <p>{t("festival.loadingFestivals")}...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="festival-calendar-page">
      <div className="calendar-content">
        <div className="calendar-left">
          <DatePicker
            inline
            selected={selectedDate}
            onChange={setSelectedDate}
            minDate={today}
            highlightDates={upcomingFestivals.map((f) => new Date(f.dateAD))}
          />
        </div>

        <div className="calendar-right">
          <h2>{t("festival.upcoming")}</h2>
          {upcomingFestivals.length === 0 ? (
            <p>{t("festival.noUpcoming")}</p>
          ) : (
            <div className="masonry">
              {upcomingFestivals.map((festival) => (
                <div
                  key={festival._id}
                  className="masonry-item small"
                  onClick={() => handleFestivalClick(festival._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleFestivalClick(festival._id)}
                  aria-label={`View details for ${
                    i18n.language === "np" ? festival.name_np : festival.name_en
                  }`}
                >
                  <img
                    className="masonry-image"
                    src={
                      festival.image
                        ? `${API_BASE_URL}/${festival.image}`
                        : "/default-festival.jpg"
                    }
                    alt={i18n.language === "np" ? festival.name_np : festival.name_en}
                    loading="lazy"
                  />
                  <div className="masonry-overlay">
                    <h2>{i18n.language === "np" ? festival.name_np : festival.name_en}</h2>
                    <span>{festival.dateBS || ""}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
