import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFestival } from '../api/festivalApi';
import './FestivalForm.css'; // Assuming this CSS exists and styles the form

export default function FestivalAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name_en: '',
    name_np: '',
    date: '',
    month: '',
    category: '',
    description_en: '',
    significance_en: '',
    duration: '',
    location_en: '',
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const nepaliMonths = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
  ];

  const categories = ['religious', 'cultural', 'national'];

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.name_en || !formData.name_np || !formData.date || !formData.month || !formData.category) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();

      // Compose Nepali date as "date month" e.g. "15 Baisakh"
      payload.append('dateBS', `${formData.date} ${formData.month}`);
      payload.append('name_en', formData.name_en);
      payload.append('name_np', formData.name_np);
      payload.append('category', formData.category);
      payload.append('description_en', formData.description_en || '');
      payload.append('significance_en', formData.significance_en || '');
      payload.append('location_en', formData.location_en || '');
      payload.append('dateAD', ''); // optional, adjust if needed

      if (formData.image) {
        payload.append('image', formData.image);
      }

      await addFestival(payload);

      // Navigate to full path with /admin prefix
      navigate('/admin/festivals');
    } catch (err) {
      if (err.response) {
        console.error('API error:', err.response.data);
      } else {
        console.error(err);
      }
      setError('Failed to add festival. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="festival-form-container">
      <h1 className="festival-list-title">Add New Festival</h1>
      <form onSubmit={handleSubmit} className="festival-form" encType="multipart/form-data">
        {error && <p className="error-text">{error}</p>}

        <label>
          Name (English) *
          <input
            type="text"
            name="name_en"
            value={formData.name_en}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Name (Nepali) *
          <input
            type="text"
            name="name_np"
            value={formData.name_np}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date (BS) *
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="e.g. 15"
            required
          />
        </label>

        <label>
          Month *
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            <option value="">Select month</option>
            {nepaliMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label>
          Category *
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Description (English)
          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleChange}
          />
        </label>

        <label>
          Significance (English)
          <textarea
            name="significance_en"
            value={formData.significance_en}
            onChange={handleChange}
          />
        </label>

        <label>
          Location (English)
          <input
            type="text"
            name="location_en"
            value={formData.location_en}
            onChange={handleChange}
          />
        </label>

        <label>
          Festival Image
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="festival-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Add Festival'}
        </button>
      </form>
    </div>
  );
}
