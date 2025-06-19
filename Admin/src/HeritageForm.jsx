import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const HeritageForm = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Edit mode: fetch existing data
      axiosInstance.get('/heritage')
        .then(res => {
          const item = res.data.find(h => h._id === id);
          if (item) setForm({ name: item.name, description: item.description || '' });
          else alert('Heritage site not found');
        })
        .catch(() => alert('Failed to load heritage site'));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await axiosInstance.put(`/admin/heritage/${id}`, form);
      } else {
        await axiosInstance.post('/admin/heritage', form);
      }
      navigate('/admin/heritage');
    } catch {
      alert('Failed to save heritage site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit' : 'Add'} Heritage Site</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label><br/>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label><br/>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
};

export default HeritageForm;
