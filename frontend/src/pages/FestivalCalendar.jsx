import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./FestivalCalendar.css";

export default function FestivalCalendar() {
  const { t } = useTranslation();
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
        const res = await axios.get("http://localhost:3000/api/festivals");
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
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  const handleFestivalClick = (id) => {
    navigate(`/festival-detail/${id}`);
  };

  return (
    <div className="festival-calendar-page">
      {loading ? (
        <p>{t("festival.loadingFestivals")}</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
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
            <div className="festival-cards">
              {upcomingFestivals.length === 0 && (
                <p>{t("festival.noUpcoming")}</p>
              )}
              {upcomingFestivals.map((festival) => (
                <div
                  key={festival._id}
                  className="festival-card"
                  onClick={() => handleFestivalClick(festival._id)}
                >
                  <div className="festival-thumb-wrapper">
                    <img
                      src={
                        festival.image
                          ? `http://localhost:3000/${festival.image}`
                          : "/default-festival.jpg"
                      }
                      alt={festival.name_en}
                      className="festival-thumb"
                    />
                  </div>
                  <h3>{festival.name_en}</h3>
                  <p>{formatDateShort(festival.dateAD)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
