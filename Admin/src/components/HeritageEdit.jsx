// src/components/HeritageEdit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';

const HeritageEdit = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const res = await axiosInstance.get('/admin/heritage');
        const site = res.data.find(item => item._id === id);
        if (!site) return alert('Heritage site not found');
        setName(site.name);
        setDescription(site.description || '');
      } catch {
        alert('Failed to fetch heritage site');
      }
    };
    fetchHeritage();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/heritage/${id}`, { name, description });
      navigate('/admin/heritage');
    } catch {
      alert('Failed to update heritage site');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Edit Heritage Site</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit" style={{ marginTop: 10 }}>Save</button>
      </form>
    </div>
  );
};

export default HeritageEdit;
