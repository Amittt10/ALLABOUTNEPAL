import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFestival } from '../api/festivalApi';
import './FestivalAdd.css';

const FestivalAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name_en: '',
    name_np: '',
    dateBS: '',
    dateAD: '',
    description_en: '',
    description_np: '',
    location_en: '',
    location_np: '',
    category: 'general',
    image: null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const requiredFields = ['name_en', 'name_np', 'dateBS'];
    const hasEmpty = requiredFields.some((field) => !form[field]);

    if (hasEmpty) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          data.append(key, value);
        }
      });

      await addFestival(data);
      navigate('/admin/festivals');
    } catch (err) {
      console.error(err);
      setError('Failed to add festival. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="festival-form">
      <h2>Add New Festival</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {error && <p className="error">{error}</p>}

        <label>Name (EN)*</label>
        <input name="name_en" value={form.name_en} onChange={handleChange} required />

        <label>Name (NP)*</label>
        <input name="name_np" value={form.name_np} onChange={handleChange} required />

        <label>Date (BS)*</label>
        <input name="dateBS" value={form.dateBS} onChange={handleChange} required placeholder="2081-04-15" />

        <label>Date (AD)</label>
        <input name="dateAD" value={form.dateAD} onChange={handleChange} placeholder="2025-09-01" />

        <label>Description (EN)</label>
        <textarea name="description_en" value={form.description_en} onChange={handleChange} />

        <label>Description (NP)</label>
        <textarea name="description_np" value={form.description_np} onChange={handleChange} />

        <label>Location (EN)</label>
        <input name="location_en" value={form.location_en} onChange={handleChange} />

        <label>Location (NP)</label>
        <input name="location_np" value={form.location_np} onChange={handleChange} />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="general">General</option>
          <option value="religious">Religious</option>
          <option value="cultural">Cultural</option>
        </select>

        <label>Festival Image</label>
        <input name="image" type="file" accept="image/*" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Festival'}
        </button>
      </form>
    </div>
  );
};

export default FestivalAdd;
