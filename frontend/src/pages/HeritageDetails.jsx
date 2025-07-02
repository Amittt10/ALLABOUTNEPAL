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
    if (user) return;

    const handleScroll = () => {
      if (!showLogin && window.scrollY > 600) {
        setShowLogin(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, showLogin]);

  const name = site?.[`name_${lang}`] || site?.name_en || site?.name || 'No Name';
  const historyRaw = site?.[`history_${lang}`] || site?.history_en || site?.history || 'No history available.';
  const location = site?.[`location_${lang}`] || site?.location || 'Unknown';
  const entryFee = site?.entryFee;
  const images = site?.gallery || [];

  const rawLines = historyRaw.split('\n').map(line => line.trim()).filter(Boolean);

  const parsedBlocks = rawLines.map(line => {
    if (line.startsWith('### ')) return { type: 'subtitle', content: line.slice(4).trim() };
    if (line.startsWith('## ')) return { type: 'heading', content: line.slice(3).trim() };
    if (line.startsWith('# ')) return { type: 'title', content: line.slice(2).trim() };
    if (/^[A-Z\s\-:]+$/.test(line) && line.length < 30) {
      return { type: 'heading', content: line.trim() };
    }
    return { type: 'paragraph', content: line };
  });

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

  if (loading) return <p className="loading">Loading heritage site...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!site) return <p className="error">No heritage site found</p>;

  return (
    <div className="heritage-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {site.image && (
        <img
          className="heritage-main-image"
          src={`http://localhost:3000/${site.image}`}
          alt={name}
          onClick={() => setFullscreenImg(`http://localhost:3000/${site.image}`)}
          style={{ cursor: 'pointer' }}
        />
      )}

      <h2 className="desc-title semibold">{name}</h2>

      <p className="location-entryfee">
        <span className="location-text italics small-font">{location}</span><br />
        <span className="entryfee-heading bold">{lang === 'np' ? 'प्रवेश शुल्क:' : 'Entry Fee:'}</span>{' '}
        <span className="entryfee-text small-font">
          {entryFee ? `₹${entryFee}` : lang === 'np' ? 'नि:शुल्क' : 'Free'}
        </span>
      </p>

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
