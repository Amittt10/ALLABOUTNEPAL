import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import { AuthContext } from '../context/AuthContext';
import LoginCard from '../Component/LoginCard';
import './HeritageDetails.css';

const HeritageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user } = useContext(AuthContext);

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const lang = i18n.language || 'en';

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:3000/api/heritage/${id}`);
        if (!res.ok) throw new Error('Error fetching heritage site');
        const data = await res.json();
        setSite(data);
      } catch (err) {
        setError('Failed to load heritage site');
        setSite(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [id, i18n.language]);

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

  if (loading) return <p className="loading">Loading heritage site...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!site) return <p className="error">No heritage site found</p>;

  const name = site[`name_${lang}`] || site.name_en || site.name || 'No Name';
  const historyRaw = site[`history_${lang}`] || site.history_en || site.history || 'No history available.';
  const location = site[`location_${lang}`] || site.location || 'Unknown';
  const entryFee = site.entryFee;
  const images = site.gallery || [];

  // --- Parse history lines for multi-level headings and paragraphs
  const rawLines = historyRaw.split('\n').map(line => line.trim()).filter(Boolean);

  const parsedBlocks = rawLines.map(line => {
    // Check for markdown heading style
    if (line.startsWith('### ')) {
      return { type: 'subtitle', content: line.slice(4).trim() };  // h4
    }
    if (line.startsWith('## ')) {
      return { type: 'heading', content: line.slice(3).trim() };   // h3
    }
    if (line.startsWith('# ')) {
      return { type: 'title', content: line.slice(2).trim() };     // h2
    }

    // Fallback: ALL CAPS line is heading (h3)
    if (/^[A-Z\s\-:]+$/.test(line) && line.length < 30) {
      return { type: 'heading', content: line.trim() };
    }

    // Else normal paragraph
    return { type: 'paragraph', content: line };
  });

  // --- Insert gallery images after every 2 paragraphs
  const descriptionBlocks = [];
  let paragraphCount = 0;
  let imageIndex = 0;

  parsedBlocks.forEach(block => {
    descriptionBlocks.push(block);

    if (block.type === 'paragraph') {
      paragraphCount++;
      if (paragraphCount % 2 === 0 && imageIndex < images.length) {
        descriptionBlocks.push({
          type: 'image',
          src: `http://localhost:3000/${images[imageIndex]}`,
          alt: `${name} image ${imageIndex + 1}`,
        });
        imageIndex++;
      }
    }
  });

  // --- Render function
  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        return <p key={key} className="desc-paragraph justify-text">{block.content}</p>;
      case "image":
        return (
          <img
            key={key}
            src={block.src}
            alt={block.alt || "Image"}
            className="inline-image"
            style={{ cursor: "pointer" }}
            onClick={() => setFullscreenImg(block.src)}
            title="Click to enlarge"
          />
        );
      case "title": // h2
        return <h2 key={key} className="desc-title semibold">{block.content}</h2>;
      case "heading": // h3
        return <h3 key={key} className="desc-heading bold">{block.content}</h3>;
      case "subtitle": // h4
        return <h4 key={key} className="desc-subtitle italics">{block.content}</h4>;
      default:
        return null;
    }
  };

  return (
    <div className="heritage-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {/* Main profile/thumbnail image */}
      {site.image && (
        <img
          className="heritage-main-image"
          src={`http://localhost:3000/${site.image}`}
          alt={name}
          onClick={() => setFullscreenImg(`http://localhost:3000/${site.image}`)}
          title="Click to enlarge"
          style={{ cursor: 'pointer' }}
        />
      )}

      {/* Title (main site name) */}
      <h2 className="desc-title semibold">{name}</h2>

      {/* Location and Entry Fee */}
      <p className="location-entryfee">
        <span className="location-text italics small-font">{location}</span><br />
        <span className="entryfee-heading bold">{lang === 'np' ? 'प्रवेश शुल्क:' : 'Entry Fee:'}</span> {' '}
        <span className="entryfee-text small-font">
          {entryFee ? `₹${entryFee}` : lang === 'np' ? 'नि:शुल्क' : 'Free'}
        </span>
      </p>

      {/* Description Content */}
      <div className="description-content">
        {!user && (
          <div className="blurred-section">
            {descriptionBlocks.map((block, idx) => renderBlock(block, idx))}
          </div>
        )}
        {user && descriptionBlocks.map((block, idx) => renderBlock(block, idx))}
      </div>

      {/* Map */}
      {isLoaded && site.lat && site.lng && (
        <div className={`map-container ${!user ? "blurred-section" : ""}`}>
          <GoogleMap
            center={{ lat: site.lat, lng: site.lng }}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "400px" }}
          >
            <Marker position={{ lat: site.lat, lng: site.lng }} />
          </GoogleMap>
        </div>
      )}

      {/* Fullscreen Image */}
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

export default HeritageDetails;
