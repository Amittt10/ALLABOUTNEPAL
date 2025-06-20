"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { axiosInstance } from "../api/axiosConfig"
import "./HeritageForm.css"

const HeritageAdd = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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

    setLoading(true)

    try {
      await axiosInstance.post("/admin/heritage", {
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
      navigate("/admin/heritage")
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Failed to add heritage site. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="heritage-form">
      <div className="form-header">
        <h1 className="form-title">Add Heritage Site</h1>
        <p className="form-subtitle">Create a new heritage site entry</p>
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
            <button type="submit" disabled={loading} className="form-button primary">
              {loading ? "Adding..." : "Add Heritage Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HeritageAdd
