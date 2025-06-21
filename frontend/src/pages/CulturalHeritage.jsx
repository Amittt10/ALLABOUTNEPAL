import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CulturalHeritage.css';

const CulturalHeritage = () => {
  const navigate = useNavigate();
  const [heritageSites, setHeritageSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeritageSites = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/heritage'); // Adjust URL as per your setup
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
        {heritageSites.map((site) => (
          <div
            key={site._id}
            className="heritage-card"
            onClick={() => navigate(`/heritage/${site._id}`)}
          >
            <img
              src={`http://localhost:3000/${site.image}`}
              alt={site.name}
              className="heritage-card-image"
            />
            <h3 className="heritage-card-title">{site.name}</h3>
            <p className="heritage-card-description">
              {site.shortDescription?.substring(0, 100) || 'No description'}
            </p>
            <button className="read-more-btn">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CulturalHeritage;
