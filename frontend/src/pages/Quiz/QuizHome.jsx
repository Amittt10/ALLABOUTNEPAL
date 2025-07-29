import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/api";
import LoginCard from "../../Component/LoginCard";
import { showCustomToast } from "../utils/showCustomToast";
import "./QuizHome.css";

const categories = ["General", "Location", "History"];
const difficulties = ["easy", "medium", "hard"];

const QuizHome = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setLoadingLeaderboard(true);
    api
      .getLeaderboard({ category, difficulty })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.leaderboard)
          ? res.data.leaderboard
          : [];
        setLeaderboard(data);
      })
      .catch(() => setLeaderboard([]))
      .finally(() => setLoadingLeaderboard(false));
  }, [category, difficulty]);

  const handleStartQuiz = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!category) {
      showCustomToast("❗ REQUIRED", "Please select a quiz category to begin.");
      return;
    }

    navigate("/quiz/play", { state: { category, difficulty } });
  };

  const handleViewFullLeaderboard = () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    navigate("/quiz/leaderboard");
  };

  return (
    <div className="quiz-home-container">
      <h1 className="page-title">Quiz Dashboard</h1>

      <div className="quiz-main-content">
        <section className="quiz-filters">
          <h2>Start New Quiz</h2>
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="category-select">Category</label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="difficulty-select">Difficulty</label>
              <select
                id="difficulty-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="button-row">
            <button className="btn btn-primary" onClick={handleStartQuiz}>
              Start Quiz
            </button>
          </div>
        </section>

        <section className="quiz-leaderboard">
          <h2>Leaderboard (Top 3)</h2>
          {loadingLeaderboard ? (
            <p>Loading leaderboard...</p>
          ) : leaderboard.length > 0 ? (
            <>
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
                  {leaderboard.slice(0, 3).map(({ userId, score, createdAt }, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="home-user-cell">
                          <img
                            src={userId?.photo ? `http://localhost:3000/${userId.photo}` : "/images/avatar.png"}
                            alt={userId?.username || "User"}
                            className="home-user-avatar"
                          />
                          <span className={`home-username medal-${idx}`}>
                            {userId?.username || "Unknown"}
                            <span className="medal-icon">
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td>{score}</td>
                      <td>{new Date(createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button className="btn-link" onClick={handleViewFullLeaderboard}>
                  View Full Leaderboard →
                </button>
              </div>
            </>
          ) : (
            <p>No leaderboard data available.</p>
          )}
        </section>
      </div>

      {!user && showLogin && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <button
              className="close-modal-btn"
              onClick={() => setShowLogin(false)}
              aria-label="Close login modal"
            >
              ×
            </button>
            <LoginCard onSuccess={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHome;
