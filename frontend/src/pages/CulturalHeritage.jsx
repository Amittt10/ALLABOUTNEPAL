import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CulturalHeritage.css';

const CulturalHeritage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [heritageSites, setHeritageSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // console.log("Current language in CulturalHeritage:", i18n.language);


  useEffect(() => {
    const fetchHeritageSites = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3000/api/heritage'); // your backend URL
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

  // Decide language suffix for fields: 'en' or 'np'
  const lang = i18n.language || 'en';

  return (
    <div className="heritage-container">
      <h2 className="heritage-title">
        {lang === 'np' ? 'नेपालका सांस्कृतिक सम्पदाहरू' : 'Cultural Heritage Sites of Nepal'}
      </h2>

      <div className="heritage-grid">
        {heritageSites.map((site) => {
          // Show name and description based on current language, fallback to English if missing
          const name = site[`name_${lang}`] || site.name_en || 'No Name';
          const shortDescription =
            site[`shortDescription_${lang}`]?.substring(0, 100) ||
            site.shortDescription_en?.substring(0, 100) ||
            'No description';

          return (
            <div
              key={site._id}
              className="heritage-card"
              onClick={() => navigate(`/heritage/${site._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={`http://localhost:3000/${site.image}`}
                alt={name}
                className="heritage-card-image"
              />
              <h3 className="heritage-card-title">{name}</h3>
              <p className="heritage-card-description">{shortDescription}</p>
              <button className="read-more-btn">Read More</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CulturalHeritage;
