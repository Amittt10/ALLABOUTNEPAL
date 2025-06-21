import React, { useState, useEffect } from 'react';
import './CulturalHeritage.css';

const CulturalHeritage = () => {
  const [heritageSites, setHeritageSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [fullscreenImg, setFullscreenImg] = useState(null);

  useEffect(() => {
    // Fetch heritage data from backend
    const fetchHeritageSites = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/heritage');
        if (!res.ok) throw new Error('Failed to fetch heritage sites');
        const data = await res.json();
        setHeritageSites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeritageSites();
  }, []);

  if (loading) return <p>Loading heritage sites...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="heritage-container">
      <h2 className="heritage-title">Cultural Heritage Sites of Nepal</h2>

      <div className="heritage-grid">
        {heritageSites.map(site => (
          <div
            key={site._id}
            className="heritage-card"
            onClick={() => setSelectedSite(site)}
          >
            <img src={`http://localhost:3000/${site.image}`} alt={site.name} />
            <h3>{site.name}</h3>
            <p>{site.description?.substring(0, 100) || 'No description'}</p>
            <button className="read-more-btn">Read More</button>
          </div>
        ))}
      </div>

      {/* Modal for selected site */}
      {selectedSite && (
        <div className="heritage-modal">
          <div className="heritage-modal-content large">
            <button className="close-btn" onClick={() => setSelectedSite(null)}>&larr; Back</button>
            <h2>{selectedSite.name}</h2>
            <p><strong>Description:</strong> {selectedSite.description}</p>

            {selectedSite.gallery && selectedSite.gallery.length > 0 && (
              <div className="heritage-gallery">
                <h4>Gallery:</h4>
                <div className="gallery-images">
                  {selectedSite.gallery.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={`http://localhost:3000/${img}`} 
                      alt={`${selectedSite.name} ${idx}`} 
                      onClick={() => setFullscreenImg(`http://localhost:3000/${img}`)} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Preview */}
      {fullscreenImg && (
        <div className="fullscreen-modal" onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} alt="Fullscreen view" />
        </div>
      )}
    </div>
  );
};

export default CulturalHeritage;
