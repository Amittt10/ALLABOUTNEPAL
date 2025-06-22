import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HeritageDetails.css';

const HeritageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  //  console.log("Current language in HeritageDetails:", i18n.language);

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  // Fetch data whenever `id` changes or language changes (to trigger rerender)
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
  }, [id, i18n.language]); // Added i18n.language so component updates on language change

  if (loading) return <p className="loading">Loading heritage site...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!site) return <p className="error">No heritage site found</p>;

  const lang = i18n.language || 'en';

  // Dynamically pick localized fields based on current language
  const name = site[`name_${lang}`] || site.name_en || site.name || 'No Name';
  const shortDescription =
    site[`shortDescription_${lang}`] ||
    site.shortDescription_en ||
    site.shortDescription ||
    'No description available.';
  const history =
    site[`history_${lang}`] || site.history_en || site.history || 'No history available.';
  const location = site[`location_${lang}`] || site.location || 'Unknown';
  const entryFee = site.entryFee;

  return (
    <div className="heritage-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <h1 className="heritage-name">{name}</h1>

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

      <div className="heritage-info">
        <p>
          <strong>{lang === 'np' ? 'वर्णन:' : 'Description:'}</strong> {shortDescription}
        </p>
        <p>
          <strong>{lang === 'np' ? 'इतिहास:' : 'History:'}</strong> {history}
        </p>
        <p>
          <strong>{lang === 'np' ? 'स्थान:' : 'Location:'}</strong> {location}
        </p>
        <p>
          <strong>{lang === 'np' ? 'प्रवेश शुल्क:' : 'Entry Fee:'}</strong> {entryFee ? `₹${entryFee}` : lang === 'np' ? 'नि:शुल्क' : 'Free'}
        </p>
      </div>

      {site.gallery && site.gallery.length > 0 && (
        <div className="heritage-gallery">
          <h2>{lang === 'np' ? 'ग्यालरी' : 'Gallery'}</h2>
          <div className="gallery-images">
            {site.gallery.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:3000/${img}`}
                alt={`${name} gallery ${idx + 1}`}
                onClick={() => setFullscreenImg(`http://localhost:3000/${img}`)}
                title="Click to enlarge"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      )}

      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen" />
        </div>
      )}
    </div>
  );
};

export default HeritageDetails;
