// src/pages/FestivalAdd.jsx
import React, { useState } from 'react';
import { addFestival } from '../api/festivalApi';
import { useNavigate } from 'react-router-dom';
import './FestivalForm.css';

const FestivalAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name_en: '',
    name_np: '',
    dateBS: '',
    dateAD: '',
    description_en: '',
    description_np: '',
    significance_en: '',
    significance_np: '',
    location_en: '',
    location_np: '',
    category: 'general',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if(value !== null) data.append(key, value);
    });
    try {
      await addFestival(data);
      navigate('/admin/festivals');
    } catch (err) {
      alert('Failed to add festival. Please try again.');
    }
  };

  return (
    <div className="festival-form">
      <h2>Add Festival</h2>
      <form onSubmit={handleSubmit}>

        <label>Name (EN)*</label>
        <input
          name="name_en"
          value={form.name_en}
          onChange={handleChange}
          required
          placeholder="English name"
        />

        <label>Name (NP)*</label>
        <input
          name="name_np"
          value={form.name_np}
          onChange={handleChange}
          required
          placeholder="नेपाली नाम"
        />

        <label>Date (BS)*</label>
        <input
          name="dateBS"
          type="text"
          value={form.dateBS}
          onChange={handleChange}
          required
          placeholder="YYYY-MM-DD"
        />

        <label>Date (AD)</label>
        <input
          name="dateAD"
          type="text"
          value={form.dateAD}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
        />

        <label>Description (EN)</label>
        <textarea
          name="description_en"
          value={form.description_en}
          onChange={handleChange}
          placeholder="Description in English"
        />

        <label>Description (NP)</label>
        <textarea
          name="description_np"
          value={form.description_np}
          onChange={handleChange}
          placeholder="नेपालीमा वर्णन"
        />

        <label>Significance (EN)</label>
        <textarea
          name="significance_en"
          value={form.significance_en}
          onChange={handleChange}
          placeholder="Significance in English"
        />

        <label>Significance (NP)</label>
        <textarea
          name="significance_np"
          value={form.significance_np}
          onChange={handleChange}
          placeholder="महत्त्व नेपालीमा"
        />

        <label>Location (EN)</label>
        <input
          name="location_en"
          value={form.location_en}
          onChange={handleChange}
          placeholder="Location in English"
        />

        <label>Location (NP)</label>
        <input
          name="location_np"
          value={form.location_np}
          onChange={handleChange}
          placeholder="स्थान नेपालीमा"
        />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="general">General</option>
          <option value="religious">Religious</option>
          <option value="cultural">Cultural</option>
          <option value="festival">Festival</option>
        </select>

        <label>Image</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit" className="btn save-btn">Save</button>
      </form>
    </div>
  );
};

export default FestivalAdd;
