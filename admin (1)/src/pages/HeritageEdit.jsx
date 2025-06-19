"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../api/axiosConfig"
import LoadingSpinner from "../components/LoadingSpinner"
import "./HeritageForm.css"

const HeritageEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const response = await axiosInstance.get("/admin/heritage")
        const site = response.data.find((item) => item._id === id)

        if (!site) {
          setErrors({ fetch: "Heritage site not found" })
          return
        }

        setFormData({
          name: site.name || "",
          description: site.description || "",
        })
      } catch (err) {
        setErrors({ fetch: "Failed to load heritage site" })
      } finally {
        setLoading(false)
      }
    }

    fetchHeritage()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Heritage site name is required"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long"
    }

    if (formData.description.trim().length > 1000) {
      newErrors.description = "Description must be less than 1000 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      await axiosInstance.put(`/admin/heritage/${id}`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
      navigate("/admin/heritage")
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Failed to update heritage site. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading heritage site..." />
  }

  if (errors.fetch) {
    return (
      <div className="heritage-form">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Error Loading Site</h2>
          <p className="error-message">{errors.fetch}</p>
          <button onClick={() => navigate("/admin/heritage")} className="form-button primary">
            Back to Heritage Sites
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="heritage-form">
      <div className="form-header">
        <h1 className="form-title">Edit Heritage Site</h1>
        <p className="form-subtitle">Update heritage site information</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Site Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={`form-input ${errors.name ? "form-input-error" : ""}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter heritage site name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className={`form-textarea ${errors.description ? "form-input-error" : ""}`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter site description (optional)"
            />
            <div className="form-help">{formData.description.length}/1000 characters</div>
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          {errors.submit && (
            <div className="form-error-banner">
              <span className="error-icon">⚠️</span>
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/admin/heritage")} className="form-button secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="form-button primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HeritageEdit
