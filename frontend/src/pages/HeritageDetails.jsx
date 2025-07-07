import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import './HeritageDetails.css';
import ReviewSection from "../Component/ReviewSection/ReviewSection";


const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const HeritageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const lang = i18n.language || 'en';

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API}/api/heritage/${id}`);
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

  const name = site?.[`name_${lang}`] || site?.name_en || site?.name || 'No Name';
  const historyRaw = site?.[`history_${lang}`] || site?.history_en || site?.history || 'No history available.';
  const location = site?.[`location_${lang}`] || site?.location || 'Unknown';
  const entryFee = site?.entryFee;
  const images = site?.gallery || [];

  const rawLines = historyRaw.split('\n').map(line => line.trim()).filter(Boolean);

  // === Enhanced block parsing with [imageX] support ===
  const descriptionBlocks = [];
  rawLines.forEach((line) => {
    if (line.startsWith('### ')) {
      descriptionBlocks.push({ type: 'subtitle', content: line.slice(4).trim() });
    } else if (line.startsWith('## ')) {
      descriptionBlocks.push({ type: 'heading', content: line.slice(3).trim() });
    } else if (line.startsWith('# ')) {
      descriptionBlocks.push({ type: 'title', content: line.slice(2).trim() });
    } else if (/^[A-Z\s\-:]+$/.test(line) && line.length < 40) {
      descriptionBlocks.push({ type: 'heading', content: line });
    } else {
      descriptionBlocks.push({ type: 'paragraph', content: line });
    }
  });

  // === Markdown-style text formatting ===
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

  // === Rendering blocks ===
  const renderBlock = (block, key) => {
    switch (block.type) {
      case "paragraph":
        // Check and render images inline like [image1], [image2]
        const parts = block.content.split(/(\[image\d+\])/i);
        return (
          <p key={key} className="desc-paragraph justify-text">
            {parts.map((part, i) => {
              const match = part.match(/\[image(\d+)\]/i);
              if (match) {
                const index = parseInt(match[1], 10) - 1;
                if (images[index]) {
                  return (
                    <img
                      key={`img-${index}`}
                      src={`${API}/${images[index]}`}
                      alt={`${name} image ${index + 1}`}
                      className="inline-image"
                      onClick={() => setFullscreenImg(`${API}/${images[index]}`)}
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

  if (loading) return <p className="loading">Loading heritage site...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!site) return <p className="error">No heritage site found</p>;

  return (
    <div className="heritage-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>

      {site.image && (
        <img
          className="heritage-main-image"
          src={`${API}/${site.image}`}
          alt={name}
          onClick={() => setFullscreenImg(`${API}/${site.image}`)}
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

      <div className="description-content">
        {descriptionBlocks.map((block, idx) => renderBlock(block, idx))}
      </div>

      {isLoaded && site.lat && site.lng && (
        <div className="map-container">
          <GoogleMap
            center={{ lat: site.lat, lng: site.lng }}
            zoom={13}
            mapContainerStyle={{ width: "100%", height: "400px" }}
          >
            <Marker position={{ lat: site.lat, lng: site.lng }} />
          </GoogleMap>
        </div>
      )}

      <ReviewSection targetType="heritage" targetId={id} />

      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
};

export default HeritageDetails;
