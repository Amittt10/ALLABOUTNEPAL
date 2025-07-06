"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axiosConfig"; // Your axios instance with api.getStats()
import LoadingSpinner from "../components/LoadingSpinner";
import "./DashboardHome.css";

const DashboardHome = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.getStats();
      setStats(response.data);
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  if (error)
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchStats} className="retry-button">
          Retry
        </button>
      </div>
    );

  // Helper to format growth with +/-
  const formatChange = (val) =>
    val != null ? `${val >= 0 ? "+" : ""}${val}%` : "0%";

  // Helper to format dates consistently
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: "👥",
      color: "purple",
      change: formatChange(stats?.userGrowth),
    },
    {
      title: "Active Users (7d)",
      value: stats?.activeUsers || 0,
      icon: "🟢",
      color: "green",
      change: formatChange(stats?.activeUserGrowth),
    },
    {
      title: "Total Heritage Sites",
      value: stats?.totalSites || 0,
      icon: "🏛️",
      color: "blue",
      change: formatChange(stats?.heritageGrowth),
    },
    {
      title: "Active Sites",
      value: stats?.activeSites || 0,
      icon: "✅",
      color: "green",
      change: "—",
    },
    {
      title: "Pending Review",
      value: stats?.pendingSites || 0,
      icon: "⏳",
      color: "yellow",
      change: "—",
    },
    {
      title: "Inactive Sites",
      value: stats?.inactiveSites || 0,
      icon: "❌",
      color: "red",
      change: "—",
    },
    {
      title: "Total Festivals",
      value: stats?.totalFestivals || 0,
      icon: "🎉",
      color: "orange",
      change: formatChange(stats?.festivalGrowth),
    },
    {
      title: "Quiz Attempts",
      value: stats?.quizStats?.totalAttempts || 0,
      icon: "❓",
      color: "cyan",
      change: formatChange(stats?.quizStats?.quizGrowth),
    },
    {
      title: "Avg. Quiz Score",
      value:
        typeof stats?.quizStats?.averageScore === "number"
          ? stats.quizStats.averageScore.toFixed(1)
          : "0",
      icon: "📊",
      color: "teal",
      change: "—",
    },
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome to the Heritage Admin Panel</p>
        <button className="refresh-button" onClick={fetchStats}>
          🔄 Refresh
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <span
                className={`stat-change ${
                  stat.change.startsWith("+")
                    ? "positive"
                    : stat.change.startsWith("-")
                    ? "negative"
                    : "neutral"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-actions">
        {/* Recent Heritage Sites */}
        <div className="action-card">
          <h3 className="action-title">Recent Heritage Sites</h3>
          <div className="activity-list">
            {stats?.recentSites?.length ? (
              stats.recentSites.map((site) => (
                <div key={site._id} className="activity-item">
                  <span className="activity-icon">🏛️</span>
                  <div className="activity-content">
                    <p className="activity-text">
                      {site.name_en || site.name || "Unnamed Site"} was added
                    </p>
                    <span className="activity-time">
                      {formatDate(site.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`activity-status status-${
                      site.status || "unknown"
                    }`}
                  >
                    {site.status || "Unknown"}
                  </span>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div className="activity-content">
                  <p className="activity-text">No recent sites</p>
                </div>
              </div>
            )}
          </div>
          <button
            className="view-all-button"
            onClick={() => navigate("/admin/heritage")}
          >
            View All Heritage Sites
          </button>
        </div>

        {/* Recent User Registrations */}
        <div className="action-card">
          <h3 className="action-title">Recent User Registrations</h3>
          <div className="activity-list">
            {stats?.recentUserRegistrations?.length ? (
              stats.recentUserRegistrations.map((user) => (
                <div key={user._id} className="activity-item">
                  <span className="activity-icon">👤</span>
                  <div className="activity-content">
                    <p className="activity-text">
                      {user.fullname || user.username} registered
                    </p>
                    <span className="activity-time">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div className="activity-content">
                  <p className="activity-text">No recent registrations</p>
                </div>
              </div>
            )}
          </div>
          <button
            className="view-all-button"
            onClick={() => navigate("/admin/users")}
          >
            View All Users
          </button>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="action-card">
          <h3 className="action-title">Recent Quiz Attempts</h3>
          <div className="activity-list">
            {stats?.recentQuizAttempts?.length ? (
              stats.recentQuizAttempts.map((attempt) => (
                <div key={attempt._id} className="activity-item">
                  <span className="activity-icon">❓</span>
                  <div className="activity-content">
                    <p className="activity-text">
                      {attempt.userName} scored {attempt.score} on{" "}
                      {attempt.quizTitle}
                    </p>
                    <span className="activity-time">
                      {formatDate(attempt.attemptDate)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <span className="activity-icon">📝</span>
                <div className="activity-content">
                  <p className="activity-text">No quiz attempts yet</p>
                </div>
              </div>
            )}
          </div>
          <button
            className="view-all-button"
            onClick={() => navigate("/admin/quiz-attempts")}
          >
            View All Quiz Attempts
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
