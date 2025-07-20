import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./FestivalCalendar.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function FestivalCalendar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setLoading(true);
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

  const futureFestivals = festivals
    .filter((f) => f.dateAD && new Date(f.dateAD) >= today)
    .sort((a, b) => new Date(a.dateAD) - new Date(b.dateAD));

  const isDateFiltered = selectedDate.toDateString() !== today.toDateString();

  const filteredFestivals = futureFestivals.filter((f) => {
    const festDate = new Date(f.dateAD);
    const matchesDate = !isDateFiltered || festDate.toDateString() === selectedDate.toDateString();
    const matchesSearch =
      f.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const nextFestival = futureFestivals[0];

  const handleFestivalClick = (festival) => {
    navigate(`/festival-detail/${festival.slug}`);
  };

  const handleAddToCalendar = (festival) => {
    const event = {
      title: festival.name_en,
      location: festival.location_en,
      details: festival.description_en,
      start: new Date(festival.dateAD),
      end: new Date(festival.dateAD),
    };

    const formatDateForGoogle = (date) =>
      date.toISOString().replace(/-|:|\.\d+/g, "") + "Z";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatDateForGoogle(event.start)}/${formatDateForGoogle(event.end)}&details=${encodeURIComponent(
      event.details
    )}&location=${encodeURIComponent(event.location)}`;

    window.open(url, "_blank");
  };

  // Inline markdown-like text formatter
  const renderFormattedText = (text) => {
    const elements = [];
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|[^*]+)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const part = match[0];

      if (part.startsWith("***") && part.endsWith("***")) {
        elements.push(
          <strong key={elements.length}>
            <em>{part.slice(3, -3)}</em>
          </strong>
        );
      } else if (part.startsWith("**") && part.endsWith("**")) {
        elements.push(<strong key={elements.length}>{part.slice(2, -2)}</strong>);
      } else if (part.startsWith("*") && part.endsWith("*")) {
        elements.push(<em key={elements.length}>{part.slice(1, -1)}</em>);
      } else {
        elements.push(<span key={elements.length}>{part}</span>);
      }
    }

    return elements;
  };

  // Clean snippet: remove headings (#) and pick first non-heading paragraph trimmed and shortened
  const cleanDescriptionSnippet = (descRaw) => {
    if (!descRaw) return "";

    const lines = descRaw.split("\n");
    let snippetLine = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) continue;
      if (trimmed.startsWith("#")) continue;
      snippetLine = trimmed;
      break;
    }
    if (!snippetLine) {
      snippetLine = lines.find(l => l.trim().length > 0) || "";
    }
    if (snippetLine.length > 150) {
      snippetLine = snippetLine.slice(0, 150) + "...";
    }
    return snippetLine;
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
            highlightDates={futureFestivals.map((f) => new Date(f.dateAD))}
            dayClassName={(date) =>
              futureFestivals.some(
                (f) => new Date(f.dateAD).toDateString() === date.toDateString()
              )
                ? "has-festival"
                : undefined
            }
          />

          {/* Upcoming Festival Info Below Calendar */}
          <div className="upcoming-info">
            <h3>{t("festival.upcoming")}</h3>
            {futureFestivals.slice(0, 3).map((festival) => (
              <div key={festival._id} className="upcoming-item">
                <h4>{i18n.language === "np" ? festival.name_np : festival.name_en}</h4>
                <p className="date">
                  {new Intl.DateTimeFormat(i18n.language === "np" ? "ne-NP" : "en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(festival.dateAD))}
                </p>
                <p className="desc">
                  {renderFormattedText(
                    cleanDescriptionSnippet(
                      i18n.language === "np"
                        ? festival.description_np
                        : festival.description_en
                    )
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="calendar-right">
          <h2>{isDateFiltered ? t("festival.eventsOnDate") : t("festival.upcoming")}</h2>

          {nextFestival && !isDateFiltered && (
            <p className="countdown">
              ⏳ {t("festival.nextFestival")}:{" "}
              {i18n.language === "np" ? nextFestival.name_np : nextFestival.name_en} –{" "}
              {Math.ceil(
                (new Date(nextFestival.dateAD) - today) / (1000 * 60 * 60 * 24)
              )}{" "}
              {t("festival.daysLeft")}
            </p>
          )}

          <div className="controls">
            <input
              type="text"
              placeholder={t("festival.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {(isDateFiltered || searchQuery.trim() !== "") && (
                <button
                  onClick={() => {
                    setSelectedDate(today);
                    setSearchQuery("");
                  }}
                  className="show-all-button"
                >
                  {t("festival.showAll")}
                </button>
              )}
              
          </div>

          {filteredFestivals.length === 0 ? (
            <p>{t("festival.noUpcoming")}</p>
          ) : (
            <div className="masonry">
              {filteredFestivals.map((festival) => (
                <div
                  key={festival._id}
                  className="masonry-item small"
                  onClick={() => handleFestivalClick(festival)}
                >
                  <button
                    className="add-calendar"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCalendar(festival);
                    }}
                    aria-label={`${t("festival.addToCalendar")} - ${festival.name_en}`}
                  >
                    ➕ {t("festival.addToCalendar")}
                  </button>

                  <img
                    className="masonry-image"
                    src={
                      festival.image
                        ? `${API_BASE_URL}/uploads/${festival.image}`
                        : "/default-festival.jpg"
                    }
                    alt={i18n.language === "np" ? festival.name_np : festival.name_en}
                    loading="lazy"
                  />

                  <div className="masonry-overlay">
                    <h2>{i18n.language === "np" ? festival.name_np : festival.name_en}</h2>
                    <span className="date">
                      {festival.dateAD
                        ? new Intl.DateTimeFormat(i18n.language === "np" ? "ne-NP" : "en-GB", {
                            day: "numeric",
                            month: "short",
                          }).format(new Date(festival.dateAD))
                        : ""}
                    </span>
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
