// src/pages/FestivalList.jsx
import React, { useEffect, useState } from 'react';
import { fetchFestivals, deleteFestival } from '../api/festivalApi';
import { useNavigate } from 'react-router-dom';
import './FestivalList.css';

const FestivalList = () => {
  const [festivals, setFestivals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFestivals().then(setFestivals);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this festival?')) {
      await deleteFestival(id);
      setFestivals(festivals.filter(f => f._id !== id));
    }
  };

  return (
    <div className="festival-list">
      <h1>Festivals</h1>
      <button className="btn add-btn" onClick={() => navigate('/admin/festivals/add')}>
        + Add Festival
      </button>
      <table>
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
          {festivals.map(festival => (
            <tr key={festival._id}>
              <td>{festival.name_en}</td>
              <td>{festival.name_np}</td>
              <td>{festival.dateBS}</td>
              <td>{festival.category}</td>
              <td>
                {festival.image ? (
                  <img
                    src={`/${festival.image.replace(/\\/g, '/')}`}
                    alt={festival.name_en}
                    className="festival-img"
                  />
                ) : (
                  'No image'
                )}
              </td>
              <td>
                <button onClick={() => navigate(`/admin/festivals/edit/${festival._id}`)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(festival._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {festivals.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No festivals found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FestivalList;
