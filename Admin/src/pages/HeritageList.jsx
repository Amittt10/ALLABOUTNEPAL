"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../api/axiosConfig"
import LoadingSpinner from "../components/LoadingSpinner"
import "./HeritageList.css"

const HeritageList = () => {
  const [heritage, setHeritage] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchHeritage = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/admin/heritage")
      setHeritage(response.data)
      setError("")
    } catch (err) {
      setError("Failed to fetch heritage sites. Please try again.")
      console.error("Error fetching heritage:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHeritage()
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await axiosInstance.delete(`/admin/heritage/${id}`)
      setHeritage(heritage.filter((item) => item._id !== id))
    } catch (err) {
      alert("Failed to delete heritage site. Please try again.")
      console.error("Error deleting heritage:", err)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading heritage sites..." />
  }

  return (
    <div className="heritage-list">
      <div className="heritage-header">
        <div>
          <h1 className="heritage-title">Heritage Sites</h1>
          <p className="heritage-subtitle">Manage your heritage sites collection</p>
        </div>
        <Link to="add" className="add-button">
          <span className="add-icon">➕</span>
          Add New Site
        </Link>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={fetchHeritage} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {heritage.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏛️</div>
          <h3 className="empty-title">No heritage sites found</h3>
          <p className="empty-description">Get started by adding your first heritage site</p>
          <Link to="add" className="empty-action">
            Add Heritage Site
          </Link>
        </div>
      ) : (
        <div className="heritage-grid">
          {heritage.map((item) => (
            <div key={item._id} className="heritage-card">
              <div className="heritage-card-header">
                <h3 className="heritage-name">{item.name}</h3>
                <div className="heritage-actions">
                  <Link to={`edit/${item._id}`} className="action-button edit" title="Edit site">
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="action-button delete"
                    title="Delete site"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {item.description && (
                <p className="heritage-description">
                  {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
                </p>
              )}

              <div className="heritage-meta">
                <span className="heritage-status">Active</span>
                <span className="heritage-date">
                  Added {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeritageList
