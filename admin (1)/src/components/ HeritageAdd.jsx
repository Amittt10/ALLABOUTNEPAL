// src/components/HeritageAdd.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';

const HeritageAdd = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/heritage', { name, description });
      navigate('/admin/heritage');
    } catch {
      alert('Failed to add heritage site');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Add Heritage Site</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit" style={{ marginTop: 10 }}>Add</button>
      </form>
    </div>
  );
};

export default HeritageAdd;
