import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/api";

import "./QuizHome.css";

const categories = ["General", "Science", "Math", "History", "Sports"];
const difficulties = ["easy", "medium", "hard"];

const QuizHome = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    setLoadingLeaderboard(true);
    api
      .getLeaderboard()
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.leaderboard)
          ? res.data.leaderboard
          : [];
        setLeaderboard(data);
      })
      .catch(() => {
        setLeaderboard([]);
      })
      .finally(() => setLoadingLeaderboard(false));
  }, []);

  const handleStartQuiz = () => {
    navigate("/quiz/play", { state: { category, difficulty } });
  };

  return (
    <div className="quiz-home-container">
      <h1 className="page-title">Quiz Dashboard</h1>

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
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleStartQuiz}
            aria-label="Start Quiz"
          >
            Start Quiz
          </button>
        </div>
      </section>

      <section className="quiz-leaderboard">
        <h2>Leaderboard</h2>
        {loadingLeaderboard ? (
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
                  <td>{userId?.username || "Unknown"}</td>
                  <td>{score}</td>
                  <td>{new Date(createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leaderboard data available.</p>
        )}
      </section>
    </div>
  );
};

export default QuizHome;
