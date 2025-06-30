import React, { useEffect, useState } from 'react';
import { fetchFestivalById, updateFestival } from '../api/festivalApi';
import { useParams, useNavigate } from 'react-router-dom';
import './FestivalForm.css';

const categories = ['general', 'religious', 'cultural', 'festival'];

const FestivalEdit = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFestival = async () => {
      try {
        const data = await fetchFestivalById(id);
        setForm({
          ...data,
          image: null, // reset image file input
        });
        setError('');
      } catch {
        setError('Failed to load festival data.');
      } finally {
        setLoading(false);
      }
    };
    loadFestival();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    if (!form.name_en || !form.name_np || !form.dateBS || !form.category) {
      setError('Please fill all required fields.');
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      }

      await updateFestival(id, formData);
      navigate('/admin/festivals');
    } catch {
      setError('Failed to update festival. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading festival data...</div>;

  return (
    <div className="festival-form-container">
      <h1>Edit Festival</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="festival-form" encType="multipart/form-data">
        <label>
          Name (English)*
          <input type="text" name="name_en" value={form.name_en} onChange={handleChange} required />
        </label>

        <label>
          Name (Nepali)*
          <input type="text" name="name_np" value={form.name_np} onChange={handleChange} required />
        </label>

        <label>
          Date (BS)*
          <input type="text" name="dateBS" value={form.dateBS} onChange={handleChange} placeholder="YYYY-MM-DD" required />
        </label>

        <label>
          Date (AD)
          <input type="text" name="dateAD" value={form.dateAD} onChange={handleChange} placeholder="YYYY-MM-DD" />
        </label>

        <label>
          Description (English)
          <textarea name="description_en" value={form.description_en} onChange={handleChange} />
        </label>

        <label>
          Description (Nepali)
          <textarea name="description_np" value={form.description_np} onChange={handleChange} />
        </label>

        <label>
          Location (English)
          <input type="text" name="location_en" value={form.location_en} onChange={handleChange} />
        </label>

        <label>
          Location (Nepali)
          <input type="text" name="location_np" value={form.location_np} onChange={handleChange} />
        </label>

        <label>
          Category*
          <select name="category" value={form.category} onChange={handleChange} required>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </label>

        <label>
          Change Festival Image (leave blank to keep current)
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
        </label>

        <button type="submit" disabled={saving} className="festival-btn">
          {saving ? 'Saving...' : 'Update Festival'}
        </button>
      </form>
    </div>
  );
};

export default FestivalEdit;
