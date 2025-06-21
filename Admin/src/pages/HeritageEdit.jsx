import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';
import './HeritageForm.css'; // Assuming you have some styles for the component

const HeritageEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    history: '',
    location: '',
    entryFee: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const res = await axiosInstance.get('/admin/heritage');
        const site = res.data.find(item => item._id === id);
        if (!site) {
          alert('Heritage site not found');
          navigate('/admin/heritage');
          return;
        }
        setFormData({
          name: site.name || '',
          shortDescription: site.shortDescription || '',
          history: site.history || '',
          location: site.location || '',
          entryFee: site.entryFee || '',
        });
      } catch (err) {
        alert('Failed to fetch heritage site');
      }
    };
    fetchHeritage();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleGalleryChange = (e) => {
    setGalleryFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('shortDescription', formData.shortDescription);
    data.append('history', formData.history);
    data.append('location', formData.location);
    data.append('entryFee', formData.entryFee);
    if (imageFile) data.append('image', imageFile);
    galleryFiles.forEach(file => data.append('gallery', file));

    try {
      await axiosInstance.put(`/admin/heritage/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Heritage site updated successfully!');
      navigate('/admin/heritage');
    } catch (err) {
      alert('Failed to update heritage site');
    }
  };

  return (
    <div className="heritage-form-container">
      <h2 className="heritage-form-title">Edit Heritage Site</h2>
      <form className="heritage-form" onSubmit={handleSubmit}>
        <label>Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Enter the heritage site name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Short Description *</label>
        <textarea
          name="shortDescription"
          placeholder="Write a short description"
          value={formData.shortDescription}
          onChange={handleChange}
          required
        />

        <label>History *</label>
        <textarea
          name="history"
          placeholder="Write the history of the heritage site"
          value={formData.history}
          onChange={handleChange}
          required
        />

        <label>Location *</label>
        <input
          type="text"
          name="location"
          placeholder="Location (e.g., Lalitpur, Nepal)"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Entry Fee *</label>
        <input
          type="text"
          name="entryFee"
          placeholder="e.g., NRs. 250 for SAARC, NRs. 1000 for foreigners"
          value={formData.entryFee}
          onChange={handleChange}
          required
        />

        <label>Main Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <label>Gallery Images (Select one or more)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryChange}
        />

        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default HeritageEdit;
