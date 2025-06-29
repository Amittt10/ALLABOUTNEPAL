import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosConfig';

const HeritageAdd = () => {
  const navigate = useNavigate();

  const [nameEn, setNameEn] = useState('');
  const [nameNp, setNameNp] = useState('');
  const [shortDescriptionEn, setShortDescriptionEn] = useState('');
  const [shortDescriptionNp, setShortDescriptionNp] = useState('');
  const [history, setHistory] = useState('');
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name_en', nameEn);
    formData.append('name_np', nameNp);
    formData.append('shortDescription_en', shortDescriptionEn);
    formData.append('shortDescription_np', shortDescriptionNp);
    formData.append('history_en', history);
    formData.append('location_en', location);
    formData.append('location_np', location);
    formData.append('entryFee', entryFee);
    formData.append('lat', lat);
    formData.append('lng', lng);

    if (imageFile) formData.append('image', imageFile);
    if (galleryFiles.length > 0) {
      Array.from(galleryFiles).forEach(file => {
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

        <label>Name (English)</label>
        <input value={nameEn} onChange={e => setNameEn(e.target.value)} required />

        <label>Name (Nepali)</label>
        <input value={nameNp} onChange={e => setNameNp(e.target.value)} required />

        <label>Short Description (English)</label>
        <textarea value={shortDescriptionEn} onChange={e => setShortDescriptionEn(e.target.value)} />

        <label>Short Description (Nepali)</label>
        <textarea value={shortDescriptionNp} onChange={e => setShortDescriptionNp(e.target.value)} />

        <label>History</label>
        <textarea value={history} onChange={e => setHistory(e.target.value)} />

        <label>Location</label>
        <input value={location} onChange={e => setLocation(e.target.value)} />

        <label>Latitude</label>
        <input value={lat} onChange={e => setLat(e.target.value)} placeholder="e.g. 27.713" />

        <label>Longitude</label>
        <input value={lng} onChange={e => setLng(e.target.value)} placeholder="e.g. 85.324" />

        <label>Entry Fee</label>
        <input type="number" value={entryFee} onChange={e => setEntryFee(e.target.value)} />

        <label>Image (Main)</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />

        <label>Gallery Images</label>
        <input type="file" accept="image/*" multiple onChange={e => setGalleryFiles(e.target.files)} />

        <button type="submit" style={{ marginTop: 15 }}>Add</button>
      </form>
    </div>
  );
};

export default HeritageAdd;
