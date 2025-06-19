"use client"

import { useState, useEffect } from "react"
import { api } from "../api/axiosConfig"
import LoadingSpinner from "../components/LoadingSpinner"
import "./DashboardHome.css"

const DashboardHome = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getStats()
        setStats(response.data)
      } catch (err) {
        setError("Failed to load dashboard statistics")
        console.error("Stats error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Heritage Sites",
      value: stats?.totalSites || 0,
      icon: "🏛️",
      color: "blue",
      change: "+12%",
    },
    {
      title: "Active Sites",
      value: stats?.activeSites || 0,
      icon: "✅",
      color: "green",
      change: "+5%",
    },
    {
      title: "Pending Review",
      value: stats?.pendingSites || 0,
      icon: "⏳",
      color: "yellow",
      change: "-2%",
    },
    {
      title: "Inactive Sites",
      value: stats?.inactiveSites || 0,
      icon: "❌",
      color: "red",
      change: "0%",
    },
  ]

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome to the Heritage Sites Admin Panel</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <span
                className={`stat-change ${stat.change.startsWith("+") ? "positive" : stat.change.startsWith("-") ? "negative" : "neutral"}`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-actions">
        <div className="action-card">
          <h3 className="action-title">Quick Actions</h3>
          <div className="action-buttons">
            <a href="/admin/heritage/add" className="action-button primary">
              <span className="action-icon">➕</span>
              Add Heritage Site
            </a>
            <a href="/admin/heritage" className="action-button secondary">
              <span className="action-icon">📋</span>
              View All Sites
            </a>
          </div>
        </div>

        <div className="action-card">
          <h3 className="action-title">Recent Activity</h3>
          <div className="activity-list">
            {stats?.recentSites?.map((site, index) => (
              <div key={site._id} className="activity-item">
                <span className="activity-icon">🏛️</span>
                <div className="activity-content">
                  <p className="activity-text">{site.name} was added</p>
                  <span className="activity-time">{new Date(site.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`activity-status status-${site.status}`}>{site.status}</span>
              </div>
            )) || (
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div className="activity-content">
                  <p className="activity-text">No recent activity</p>
                  <span className="activity-time">Start by adding a heritage site</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
