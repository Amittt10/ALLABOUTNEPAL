import React, { useState, useEffect } from "react";
import { api } from "../../api/api";
import "./Leaderboard.css";

const categories = ["All", "General", "Location", "History"];
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
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
        <>
          {/* TOP 3 USERS */}
          <div className="top-three-container">
            {leaderboard
              .slice(0, 3)
              .map(({ userId, score, createdAt }, idx) => (
                <div className={`top-user-card rank-${idx + 1}`} key={idx}>
                  <div className="top-avatar-wrapper">
                    <img
                      src={
                        userId?.photo
                          ? `http://localhost:3000/${userId.photo}`
                          : "/images/avatar.png"
                      }
                      alt={userId?.username || "User"}
                      className="top-avatar"
                    />
                    <div
                      className={`badge-icon ${
                        ["gold", "silver", "bronze"][idx]
                      }`}
                    >
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                    </div>
                  </div>
                  <div className="top-user-info">
                    <h3>{userId?.username || "Unknown"}</h3>
                    <p>
                      Score: <strong>{score}</strong>
                    </p>
                    <p>{new Date(createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
          </div>

          {/* REMAINING USERS */}
          {leaderboard.length > 3 && (
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
                {leaderboard
                  .slice(3)
                  .map(({ userId, score, createdAt }, idx) => (
                    <tr key={idx + 3}>
                      <td style={{ textAlign: "center" }}>{idx + 4}</td>
                      <td className="user-cell">
                        <div className="user-info-wrapper">
                          <img
                            src={
                              userId?.photo
                                ? `http://localhost:3000/${userId.photo}`
                                : "/images/avatar.png"
                            }
                            alt={userId?.username || "User"}
                            className="leaderboard-avatar"
                          />
                          <span className="username-text">
                            {userId?.username || "Unknown"}
                          </span>
                        </div>
                      </td>

                      <td style={{ textAlign: "center" }}>{score}</td>
                      <td style={{ textAlign: "center" }}>
                        {new Date(createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <p>No leaderboard data available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
