import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { AuthContext } from "../../context/AuthContext";
import LoginCard from "../../Component/LoginCard";
import "./PlaceDetail.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PlaceDetail() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user } = useContext(AuthContext);

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const lang = i18n.language || "en";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API}/api/places/${placeId}`);
        setPlace(res.data);
      } catch (err) {
        setError("Failed to load place details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [placeId]);

  useEffect(() => {
    if (user) return;
    const handleScroll = () => {
      if (!showLogin && window.scrollY > 600) setShowLogin(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, showLogin]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <p className="loading">Loading place details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!place) return <p className="error">Place not found</p>;

  const title = place?.[`title_${lang}`] || place?.title_en || place?.title || "No Title";
  const descriptionRaw = place?.[`description_${lang}`] || place?.description_en || "No description.";
  const videoUrl = place?.video_url || "";
  const thumbnail = place?.thumbnail ? `${API}${place.thumbnail}` : null;
  const gallery = place?.images || [];

  const rawLines = descriptionRaw.split("\n").map(line => line.trim()).filter(Boolean);

  const parsedBlocks = rawLines.map(line => {
    if (line.startsWith("### ")) return { type: "subtitle", content: line.slice(4).trim() };
    if (line.startsWith("## ")) return { type: "heading", content: line.slice(3).trim() };
    if (line.startsWith("# ")) return { type: "title", content: line.slice(2).trim() };
    if (/^[A-Z\s\-:]+$/.test(line) && line.length < 30) return { type: "heading", content: line.trim() };
    return { type: "paragraph", content: line };
  });

  const descriptionBlocks = [];
  let paragraphCount = 0;
  let imageIndex = 0;

  parsedBlocks.forEach(block => {
    descriptionBlocks.push(block);
    if (block.type === "paragraph") {
      paragraphCount++;
      if (paragraphCount % 2 === 0 && imageIndex < gallery.length) {
        descriptionBlocks.push({
          type: "image",
          src: `${API}${gallery[imageIndex]}`,
          alt: `${title} image ${imageIndex + 1}`,
        });
        imageIndex++;
      }
    }
  });

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
        return <p key={key} className="desc-paragraph justify-text">{renderFormattedText(block.content)}</p>;
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

  return (
    <div className="place-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {/* Video at the top */}
      {videoUrl && (
        <div className="video-wrapper">
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="place-video-top"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="main-title">{title}</h1>

      {/* Description */}
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

      {/* Map */}
      {isLoaded && place.location?.lat && place.location?.lng && (
        <div className={`map-container ${!user ? "blurred-section" : ""}`}>
          <GoogleMap
            center={{ lat: place.location.lat, lng: place.location.lng }}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <Marker position={{ lat: place.location.lat, lng: place.location.lng }} />
          </GoogleMap>
        </div>
      )}

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
            <button className="close-modal-btn" onClick={() => setShowLogin(false)}>×</button>
            <LoginCard onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
