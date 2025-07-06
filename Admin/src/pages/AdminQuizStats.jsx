import React, { useEffect, useState } from 'react';
import { api } from '../api/axiosConfig';
import './AdminQuizStats.css';

const AdminQuizStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.getQuizStatistics(); // Your backend endpoint: /admin/quiz/statistics
      setStats(res.data);
    } catch (err) {
      console.error('Error loading quiz stats:', err);
      setError('Failed to load quiz statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="admin-loading">Loading quiz stats...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <div className="admin-quiz-stats">
      <h2>Quiz Statistics Overview</h2>

      <section className="quiz-section">
        <h3>Top Scoring Users</h3>
        <ul>
          {stats.topUsers && stats.topUsers.length ? (
            stats.topUsers.map((user, idx) => (
              <li key={idx}>
                {user.userName} – {user.totalScore} pts
              </li>
            ))
          ) : (
            <li>No top scorers yet.</li>
          )}
        </ul>
      </section>

      <section className="quiz-section">
        <h3>Most Played Categories</h3>
        <ul>
          {stats.mostPlayed && stats.mostPlayed.length ? (
            stats.mostPlayed.map((item, idx) => (
              <li key={idx}>
                {item.category} – {item.count} plays
              </li>
            ))
          ) : (
            <li>No data available.</li>
          )}
        </ul>
      </section>

      <section className="quiz-section">
        <h3>Average Scores by Category</h3>
        <ul>
          {stats.averageScores && stats.averageScores.length ? (
            stats.averageScores.map((item, idx) => (
              <li key={idx}>
                {item.category}: {item.avgScore.toFixed(1)} pts
              </li>
            ))
          ) : (
            <li>No scores yet.</li>
          )}
        </ul>
      </section>

      {/* If you want to include personal quiz history, 
          make sure your backend provides it at stats.personalHistory as an array */}
      {stats.personalHistory && (
        <section className="quiz-section">
          <h3>Personal Quiz History</h3>
          <ul>
            {stats.personalHistory.length ? (
              stats.personalHistory.map((item, idx) => (
                <li key={idx}>
                  {new Date(item.attemptDate).toLocaleDateString()} – {item.quizTitle} – {item.score} pts
                </li>
              ))
            ) : (
              <li>No attempts made.</li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AdminQuizStats;
