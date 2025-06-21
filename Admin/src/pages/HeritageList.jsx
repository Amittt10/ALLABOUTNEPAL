import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';
import './HeritageList.css'; // Assuming you have some styles for the component

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
    <div style={{ maxWidth: 700, margin: '2rem auto', color: '#eee', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <h2>Heritage Sites</h2>
      <Link to="add" style={{ marginBottom: 12, display: 'inline-block', color: '#f0a500', fontWeight: '600' }}>
        + Add New Heritage Site
      </Link>
      {heritage.length === 0 ? (
        <p>No heritage sites found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Entry Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {heritage.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>{item.entryFee}</td>
                <td>
                  <Link to={`edit/${item._id}`} style={{ marginRight: 10 }}>Edit</Link>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HeritageList;
