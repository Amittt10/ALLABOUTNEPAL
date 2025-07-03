import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [topResults, setTopResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('/api/quiz/leaderboard');
      setTopResults(res.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Quiz Leaderboard</h2>
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : topResults.length === 0 ? (
        <p>No leaderboard data available.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
              <th>Category</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {topResults.map((result, idx) => (
              <tr key={result._id}>
                <td>{idx + 1}</td>
                <td>{result.userId?.username || 'Unknown'}</td>
                <td>{result.score}</td>
                <td>{result.category || 'All'}</td>
                <td>{result.difficulty || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
