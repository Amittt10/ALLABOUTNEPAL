import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import LoginCard from "../Component/LoginCard";
import "./FestivalDetails.css";

const FestivalDetailById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user } = useContext(AuthContext);

  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const lang = i18n.language || "en";

  useEffect(() => {
    const fetchFestival = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:3000/api/festivals/${id}`);
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

  useEffect(() => {
    if (user) return;
    const handleScroll = () => {
      if (!showLogin && window.scrollY > 600) setShowLogin(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, showLogin]);

  const name = festival?.[`name_${lang}`] || festival?.name_en || "No Name";
  const dateAD = festival?.dateAD || "";
  const location = festival?.[`location_${lang}`] || festival?.location_en || "Unknown location";
  const category = festival?.category || "N/A";
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
    if (/^[A-Z\s\-:]+$/.test(line) && line.length < 30) {
      return { type: "heading", content: line.trim() };
    }
    return { type: "paragraph", content: line };
  });

  const descriptionBlocks = [];
  let paragraphCount = 0;
  let imageIndex = 0;

  parsedBlocks.forEach(block => {
    descriptionBlocks.push(block);

    if (block.type === 'paragraph') {
      paragraphCount++;
      if (paragraphCount % 2 === 0 && imageIndex < gallery.length) {
        descriptionBlocks.push({
          type: "image",
          src: `http://localhost:3000/uploads/${gallery[imageIndex]}`,
          alt: `${name} image ${imageIndex + 1}`
        });
        imageIndex++;
      }
    }
  });

  // ✅ Markdown-style inline formatter
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

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={key} className="desc-paragraph justify-text">
            {renderFormattedText(block.content)}
          </p>
        );
      case "image":
        return (
          <img
            key={key}
            src={block.src}
            alt={block.alt || "Image"}
            className="inline-image"
            onClick={() => setFullscreenImg(block.src)}
            style={{ cursor: "pointer" }}
          />
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
  if (error)
    return (
      <div className="festival-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <p className="error">{error}</p>
      </div>
    );

  return (
    <div className="festival-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {festival.image && (
        <img
          src={`http://localhost:3000/uploads/${festival.image}`}
          alt={name}
          className="festival-main-image"
          onClick={() => setFullscreenImg(`http://localhost:3000/uploads/${festival.image}`)}
        />
      )}

      <h2 className="desc-title semibold">{name}</h2>
      <p className="festival-date">{formatDate(dateAD)}</p>

      <p className="location-entryfee">
        <span className="location-text italics small-font">{location}</span><br />
      </p>

      <div className="description-content">
        {!user ? (
          <>
            {descriptionBlocks.slice(0, 4).map((block, idx) => renderBlock(block, idx))}
            <div className="blurred-section">
              {descriptionBlocks.slice(4).map((block, idx) => renderBlock(block, idx + 4))}
            </div>
          </>
        ) : (
          descriptionBlocks.map((block, idx) => renderBlock(block, idx))
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}

      {/* Login Modal */}
      {!user && showLogin && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <button className="close-modal-btn" onClick={() => setShowLogin(false)}>
              ×
            </button>
            <LoginCard onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalDetailById;
