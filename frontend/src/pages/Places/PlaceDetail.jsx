import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { places } from "../../data/staticPlaces";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { AuthContext } from "../../context/AuthContext";
import UserLogin from "../UserLogin"; // Adjust path if needed
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
    const onScroll = () => {
      if (!user && window.scrollY > 300) {
        setShowLogin(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [user]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = showLogin && !user ? "hidden" : "auto";
  }, [showLogin, user]);

  return (
    <div className="place-detail-page">
      {/* Video */}
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

      {/* Title */}
      <h1>{i18n.language === "np" ? place.title_np : place.title_en}</h1>

      {/* Description */}
      <div className={`description-content ${!user ? "blurred" : ""}`}>
        {desc.map((paragraph, idx) => (
          <React.Fragment key={idx}>
            <p>{paragraph}</p>
            {idx < place.images.length && (
              <img
                src={place.images[idx]}
                alt={`Extra ${idx + 1}`}
                className="inline-image"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Map */}
      <div className={`map-container ${!user ? "blurred" : ""}`}>
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

      {/* Login Modal */}
      {!user && showLogin && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <UserLogin onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
