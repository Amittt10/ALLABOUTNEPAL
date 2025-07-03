import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import "./Leaderboard.css";

const categories = ["All", "General", "Science", "Math", "History", "Sports"];
const difficulties = ["All", "easy", "medium", "hard"];

const Leaderboard = () => {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const cat = category === "All" ? "" : category;
    const diff = difficulty === "All" ? "" : difficulty;

    api
      .getLeaderboard({ category: cat, difficulty: diff })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.leaderboard)
          ? res.data.leaderboard
          : [];
        setLeaderboard(data);
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, [category, difficulty]);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>

      <div className="filters">
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : leaderboard.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(({ userId, score, createdAt }, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {userId?.photo ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${userId.photo}`}
                      alt={userId.username}
                      style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#ccc",
                        display: "inline-block",
                      }}
                    />
                  )}
                  <span>{userId?.username || "Unknown"}</span>
                </td>
                <td>{score}</td>
                <td>{new Date(createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leaderboard data available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
