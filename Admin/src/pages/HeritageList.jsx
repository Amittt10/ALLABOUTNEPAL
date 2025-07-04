// src/pages/HeritageList.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../api/axiosConfig'
import { useTranslation } from 'react-i18next'
import './HeritageList.css'

const HeritageList = () => {
  const { i18n } = useTranslation()
  const [heritage, setHeritage] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHeritage() {
      try {
        const { data } = await axiosInstance.get('/admin/heritage')
        setHeritage(data)
      } catch (err) {
        alert('Failed to fetch heritage sites')
      } finally {
        setLoading(false)
      }
    }
    fetchHeritage()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this heritage site?')) return
    try {
      await axiosInstance.delete(`/admin/heritage/${id}`)
      setHeritage((prev) => prev.filter((item) => item._id !== id))
    } catch {
      alert('Error deleting')
    }
  }

  if (loading) return <p>Loading heritage sites...</p>

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', color: 'black' }}>
      <h2>Heritage Sites</h2>
      <Link to="add" style={{ color: '#f0a500', fontWeight: '600' }}>+ Add New</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Entry Fee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {heritage.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No heritage sites found.</td>
            </tr>
          ) : (
            heritage.map((site) => {
              const name = site[`name_${i18n.language}`] || site.name_en
              const location = site.location_en || 'Unknown location'
              return (
                <tr key={site._id}>
                  <td>{name}</td>
                  <td>{location}</td>
                  <td>{site.entryFee ? `₹${site.entryFee}` : 'Free'}</td>
                  <td>
                    <Link to={`edit/${site._id}`} style={{ marginRight: 10 }}>Edit</Link>
                    <button onClick={() => handleDelete(site._id)}>Delete</button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default HeritageList
