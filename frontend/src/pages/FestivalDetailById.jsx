import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./FestivalDetails.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const FestivalDetailById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/festivals/${id}`);
        if (!res.ok) throw new Error("Error fetching festival");
        const data = await res.json();
        setFestival(data);
      } catch (err) {
        setError("Failed to load festival details.");
        setFestival(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFestival();
  }, [id]);

  const name = festival?.[`name_${lang}`] || festival?.name_en || "No Name";
  const dateAD = festival?.dateAD || "";
  const location = festival?.[`location_${lang}`] || festival?.location_en || "Unknown location";
  const gallery = festival?.gallery || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "np" ? "ne-NP" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const descriptionRaw = festival?.[`description_${lang}`] || festival?.description_en || "No content available.";
  const rawLines = descriptionRaw.split("\n").map(line => line.trim()).filter(Boolean);

  const parsedBlocks = rawLines.map(line => {
    if (line.startsWith("### ")) return { type: "subtitle", content: line.slice(4).trim() };
    if (line.startsWith("## ")) return { type: "heading", content: line.slice(3).trim() };
    if (line.startsWith("# ")) return { type: "title", content: line.slice(2).trim() };
    if (/^[A-Z\s\-:]+$/.test(line) && line.length < 40) {
      return { type: "heading", content: line.trim() };
    }
    return { type: "paragraph", content: line };
  });

  const renderFormattedText = (text) => {
    const elements = [];
    const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|[^*]+)/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const part = match[0];

      if (part.startsWith("***") && part.endsWith("***")) {
        elements.push(<strong key={elements.length}><em>{part.slice(3, -3)}</em></strong>);
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

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        const parts = block.content.split(/(\[image\d+\])/i);
        return (
          <p key={key} className="desc-paragraph justify-text">
            {parts.map((part, i) => {
              const match = part.match(/\[image(\d+)\]/i);
              if (match) {
                const index = parseInt(match[1], 10) - 1;
                if (gallery[index]) {
                  return (
                    <img
                      key={`img-${index}`}
                      src={`${API}/uploads/${gallery[index]}`}
                      alt={`${name} image ${index + 1}`}
                      className="inline-image"
                      onClick={() => setFullscreenImg(`${API}/uploads/${gallery[index]}`)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                }
                return null;
              } else {
                return <React.Fragment key={`text-${i}`}>{renderFormattedText(part)}</React.Fragment>;
              }
            })}
          </p>
        );

      case "title":
        return <h2 key={key} className="desc-title semibold">{block.content}</h2>;
      case "heading":
        return <h3 key={key} className="desc-heading bold">{block.content}</h3>;
      case "subtitle":
        return <h4 key={key} className="desc-subtitle italics">{block.content}</h4>;
      default:
        return null;
    }
  };

  if (loading) return <p className="loading">Loading festival details...</p>;

  return (
    <div className="festival-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {festival?.image && (
        <img
          src={`${API}/uploads/${festival.image}`}
          alt={name}
          className="festival-main-image"
          onClick={() => setFullscreenImg(`${API}/uploads/${festival.image}`)}
        />
      )}

      <h2 className="desc-title semibold">{name}</h2>
      <p className="festival-date">{formatDate(dateAD)}</p>
      <p className="location-entryfee">
        <span className="location-text italics small-font">{location}</span>
      </p>

      <div className="description-content">
        {parsedBlocks.map((block, idx) => renderBlock(block, idx))}
      </div>

      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
};

export default FestivalDetailById;
