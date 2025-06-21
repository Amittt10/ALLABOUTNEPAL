import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosConfig';

const HeritageAdd = () => {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [history, setHistory] = useState('');
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState('');
  
  // File inputs state
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('shortDescription', shortDescription);
    formData.append('history', history);
    formData.append('location', location);
    formData.append('entryFee', entryFee);

    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (galleryFiles.length > 0) {
      Array.from(galleryFiles).forEach((file) => {
        formData.append('gallery', file);
      });
    }

    try {
      await api.createHeritage(formData);
      navigate('/admin/heritage');
    } catch (error) {
      alert('Failed to add heritage site');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Add Heritage Site</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Short Description</label>
        <textarea
          value={shortDescription}
          onChange={e => setShortDescription(e.target.value)}
        />

        <label>History</label>
        <textarea
          value={history}
          onChange={e => setHistory(e.target.value)}
        />

        <label>Location</label>
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
        />

        <label>Entry Fee</label>
        <input
          type="number"
          value={entryFee}
          onChange={e => setEntryFee(e.target.value)}
        />

        <label>Image (Main)</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
        />

        <label>Gallery Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => setGalleryFiles(e.target.files)}
        />

        <button type="submit" style={{ marginTop: 15 }}>Add</button>
      </form>
    </div>
  );
};

export default HeritageAdd;
