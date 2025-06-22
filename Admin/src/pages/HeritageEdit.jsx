import React, { useState, useEffect } from 'react'
import { axiosInstance } from '../api/axiosConfig'
import { useNavigate, useParams } from 'react-router-dom'
import './HeritageForm.css'

const HeritageEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name_en: '',
    name_np: '',
    shortDescription_en: '',
    shortDescription_np: '',
    history_en: '',
    history_np: '',
    location_en: '',
    location_np: '',
    entryFee: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/heritage/${id}`)
        setFormData({
          name_en: data.name_en || '',
          name_np: data.name_np || '',
          shortDescription_en: data.shortDescription_en || '',
          shortDescription_np: data.shortDescription_np || '',
          history_en: data.history_en || '',
          history_np: data.history_np || '',
          location_en: data.location_en || '',
          location_np: data.location_np || '',
          entryFee: data.entryFee || '',
        })
      } catch (err) {
        alert('Failed to load heritage site')
        navigate('/admin/heritage')
      }
    }
    fetchHeritage()
  }, [id, navigate])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleImageChange = (e) => setImageFile(e.target.files[0])
  const handleGalleryChange = (e) => setGalleryFiles(Array.from(e.target.files))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    Object.keys(formData).forEach((key) => data.append(key, formData[key]))

    if (imageFile) data.append('image', imageFile)
    galleryFiles.forEach((file) => data.append('gallery', file))

    try {
      await axiosInstance.put(`/admin/heritage/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('Heritage site updated successfully!')
      navigate('/admin/heritage')
    } catch (err) {
      alert('Error updating heritage')
    }
  }

  return (
    <div className="heritage-form-container">
      <h2 className="heritage-form-title">Edit Heritage Site</h2>
      <form className="heritage-form" onSubmit={handleSubmit}>

        <label>Name (English) *</label>
        <input name="name_en" value={formData.name_en} onChange={handleChange} required />

        <label>Name (Nepali) *</label>
        <input name="name_np" value={formData.name_np} onChange={handleChange} required />

        <label>Short Description (English) *</label>
        <textarea name="shortDescription_en" value={formData.shortDescription_en} onChange={handleChange} required />

        <label>Short Description (Nepali) *</label>
        <textarea name="shortDescription_np" value={formData.shortDescription_np} onChange={handleChange} required />

        <label>History (English) *</label>
        <textarea name="history_en" value={formData.history_en} onChange={handleChange} required />

        <label>History (Nepali) *</label>
        <textarea name="history_np" value={formData.history_np} onChange={handleChange} required />

        <label>Location (English) *</label>
        <input name="location_en" value={formData.location_en} onChange={handleChange} required />

        <label>Location (Nepali) *</label>
        <input name="location_np" value={formData.location_np} onChange={handleChange} required />

        <label>Entry Fee *</label>
        <input name="entryFee" value={formData.entryFee} onChange={handleChange} required />

        <label>Main Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <label>Gallery Images</label>
        <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />

        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  )
}

export default HeritageEdit
