import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { places } from "../../data/staticPlaces";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { AuthContext } from "../../context/AuthContext";
import LoginCard from "../../Component/LoginCard"; 
import "./PlaceDetail.css";

export default function PlaceDetail() {
  const { placeId } = useParams();
  const { i18n } = useTranslation();
  const { user } = useContext(AuthContext);

  const place = places.find((p) => p.id === placeId);
  if (!place) return <div>Place not found.</div>;

  const desc = i18n.language === "np" ? place.description_np : place.description_en;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!user && !showLogin && window.scrollY > 300) {
        setShowLogin(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [user, showLogin]);

  const visibleCount = 4;
  const visibleBlocks = desc.slice(0, visibleCount);
  const hiddenBlocks = desc.slice(visibleCount);

  const renderBlock = (block, key) => {
    switch (block.type) {
      case "title":
        return <h2 key={key} className="desc-title semibold">{block.content}</h2>;
      case "subtitle":
        return <h4 key={key} className="desc-subtitle italics">{block.content}</h4>;
      case "heading":
        return <h3 key={key} className="desc-heading bold">{block.content}</h3>;
      case "paragraph":
        return <p key={key} className="desc-paragraph justify-text">{block.content}</p>;
      case "image":
        return (
          <img
            key={key}
            src={block.src}
            alt={block.alt || "Image"}
            className="inline-image"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="place-detail-page">
      <div className="video-wrapper">
        <video
          src={place.video_url}
          autoPlay
          loop
          muted
          playsInline
          className="place-video-top"
        />
      </div>

      <h1 className="main-title">
        {i18n.language === "np" ? place.title_np : place.title_en}
      </h1>

      <div className="description-content">
        {visibleBlocks.map((block, idx) => renderBlock(block, idx))}

        {!user && (
          <div className="blurred-section">
            {hiddenBlocks.map((block, idx) => renderBlock(block, idx + visibleCount))}
            {/* You can remove this if images are already inline in description */}
            {/* {place.images.map((imgSrc, idx) => (
              <img key={`img-${idx}`} src={imgSrc} alt={`Extra ${idx + 1}`} className="inline-image" />
            ))} */}
          </div>
        )}

        {user && (
          <>
            {hiddenBlocks.map((block, idx) => renderBlock(block, idx + visibleCount))}
            {/* You can remove this if images are inline */}
            {/* {place.images.map((imgSrc, idx) => (
              <img key={`img-${idx}`} src={imgSrc} alt={`Extra ${idx + 1}`} className="inline-image" />
            ))} */}
          </>
        )}
      </div>

      <div className={`map-container ${!user ? "blurred-section" : ""}`}>
        {isLoaded ? (
          <GoogleMap
            center={place.location}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "400px" }}
          >
            <Marker position={place.location} />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      {!user && showLogin && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <button
              className="close-modal-btn"
              onClick={() => setShowLogin(false)}
              aria-label="Close"
            >
              ×
            </button>
            <LoginCard onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
