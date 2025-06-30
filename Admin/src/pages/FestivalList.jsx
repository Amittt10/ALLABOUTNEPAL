import React, { useEffect, useState } from 'react';
import { fetchFestivals, deleteFestival } from '../api/festivalApi';
import { useNavigate } from 'react-router-dom';
import './FestivalList.css';

const FestivalList = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFestivals();
  }, []);

  const loadFestivals = async () => {
    setLoading(true);
    try {
      const data = await fetchFestivals();
      setFestivals(data);
      setError(null);
    } catch {
      setError('Failed to load festivals.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this festival?')) return;
    try {
      await deleteFestival(id);
      loadFestivals();
    } catch {
      alert('Delete failed. Please try again.');
    }
  };

  return (
    <div className="festival-list-container">
      <div className="festival-list-header">
        <h1>Festival Management</h1>
        <button className="btn-add" onClick={() => navigate('/admin/festivals/add')}>
          + Add New Festival
        </button>
      </div>

      {loading && <p>Loading festivals...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && festivals.length === 0 && <p>No festivals found.</p>}

      {!loading && festivals.length > 0 && (
        <table className="festival-table">
          <thead>
            <tr>
              <th>Name (EN)</th>
              <th>Name (NP)</th>
              <th>Date (BS)</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {festivals.map((festival) => (
              <tr key={festival._id}>
                <td>{festival.name_en}</td>
                <td>{festival.name_np}</td>
                <td>{festival.dateBS || festival.date}</td>
                <td>{festival.category}</td>
                <td>
                  {festival.image ? (
                    <img
                      src={`/uploads/${festival.image.replace(/\\/g, '/')}`}
                      alt={festival.name_en}
                      className="festival-img"
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/admin/festivals/edit/${festival._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(festival._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FestivalList;
