import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendedList.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const RecommendedList = ({ targetType, excludeId, lang = 'en' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getRoute = (type, id) => {
    switch (type) {
      case 'place':
        return `/places/${id}`;
      case 'festival':
        return `/festival-detail/${id}`;
      case 'heritage':
        return `/heritage/${id}`;
      default:
        return '/';
    }
  };

  useEffect(() => {
    if (!targetType || !excludeId) return;

    const fetchRecommended = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API}/api/recommended?type=${targetType}&exclude=${excludeId}&lang=${lang}`
        );
        if (!res.ok) throw new Error('Failed to fetch recommended items');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message || 'Error fetching recommendations');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [targetType, excludeId, lang]);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (items.length === 0) return <p>No recommendations available.</p>;

  return (
    <div className="recommended-section">
      <h3 className="recommended-title">{lang === 'np' ? 'थप अन्वेषण गर्नुहोस्' : 'Explore More'}</h3>
      <div className="recommended-grid-wrapper">
        <div className="masonry">
          {items.map(item => {
            const name = item.name || 'Unnamed';
            const image = item.image || '';
            const extra = item.extra || '';

            return (
              <div
                key={item._id}
                className="masonry-item"
                onClick={() => navigate(getRoute(targetType, item._id))}
                style={{ cursor: 'pointer' }}
              >
                {image && (
                  <img
                    src={`${API}/${image}`}
                    alt={name}
                    className="masonry-image"
                    loading="lazy"
                  />
                )}
                <div className="masonry-overlay">
                  <h2>{name}</h2>
                  {extra && <div className="location">{extra}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendedList;
