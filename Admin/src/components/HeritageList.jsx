// src/components/HeritageList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';

const HeritageList = () => {
  const [heritage, setHeritage] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHeritage = async () => {
    try {
      const res = await axiosInstance.get('/admin/heritage');
      setHeritage(res.data);
    } catch {
      alert('Failed to fetch heritage sites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeritage();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this heritage site?')) return;
    try {
      await axiosInstance.delete(`/admin/heritage/${id}`);
      setHeritage(heritage.filter(item => item._id !== id));
    } catch {
      alert('Failed to delete heritage site');
    }
  };

  if (loading) return <p>Loading heritage sites...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Heritage Sites</h2>
      <Link to="add" style={{ marginBottom: 12, display: 'inline-block' }}>+ Add New</Link>
      {heritage.length === 0 ? (
        <p>No heritage sites found.</p>
      ) : (
        <ul>
          {heritage.map(item => (
            <li key={item._id} style={{ marginBottom: 8 }}>
              <strong>{item.name}</strong>
              <button style={{ marginLeft: 10 }} onClick={() => handleDelete(item._id)}>Delete</button>
              <Link style={{ marginLeft: 10 }} to={`edit/${item._id}`}>Edit</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HeritageList;
