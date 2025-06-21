import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HeritageDetails.css';

const HeritageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/heritage/${id}`);
        if (!res.ok) throw new Error('Error fetching heritage site');
        const data = await res.json();
        setSite(data);
      } catch (err) {
        setError('Failed to load heritage site');
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [id]);

  if (loading) return <p className="loading">Loading heritage site...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!site) return <p className="error">No heritage site found</p>;

  return (
    <div className="heritage-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>

      <h1 className="heritage-name">{site.name}</h1>

      {site.image && (
        <img
          className="heritage-main-image"
          src={`http://localhost:3000/${site.image}`}
          alt={site.name}
          onClick={() => setFullscreenImg(`http://localhost:3000/${site.image}`)}
          title="Click to enlarge"
        />
      )}

      <div className="heritage-info">
        <p><strong>Description:</strong> {site.shortDescription || 'No description available.'}</p>
        <p><strong>History:</strong> {site.history || 'No history available.'}</p>
        <p><strong>Location:</strong> {site.location || 'Unknown'}</p>
        <p><strong>Entry Fee:</strong> {site.entryFee ? `₹${site.entryFee}` : 'Free'}</p>
      </div>

      {site.gallery && site.gallery.length > 0 && (
        <div className="heritage-gallery">
          <h2>Gallery</h2>
          <div className="gallery-images">
            {site.gallery.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:3000/${img}`}
                alt={`${site.name} gallery ${idx + 1}`}
                onClick={() => setFullscreenImg(`http://localhost:3000/${img}`)}
                title="Click to enlarge"
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
