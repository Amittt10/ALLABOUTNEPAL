import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Fix: import AuthContext
import { api } from "../../api/api"; // centralized API
import "./QuizHistory.css";

const QuizHistory = () => {
  // Get both user and loading from AuthContext
  const { user, loading: authLoading } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true); // loading for history fetch
  const [error, setError] = useState("");
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    highestScore: 0,
    badges: [],
  });

  useEffect(() => {
    const fetchHistoryAndStats = async () => {
      // Wait until auth loading finishes
      if (authLoading) return;

      if (!user?._id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const resHistory = await api.getUserProgress(user._id);
        setHistory(resHistory.data || []);

        if (user.quizStats) {
          setQuizStats({
            totalQuizzes: user.quizStats.totalQuizzes || 0,
            highestScore: user.quizStats.highestScore || 0,
            badges: user.quizStats.badges || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch quiz history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryAndStats();
  }, [user, authLoading]); // add authLoading here

  if (loading) return <div className="quiz-history-container">Loading...</div>;
  if (error) return <div className="quiz-history-container error">{error}</div>;

  return (
    <div className="quiz-history-container">
      <h2>Your Quiz History</h2>

      {/* Quiz Summary */}
      <div className="quiz-summary">
        <div><strong>Total Quizzes Played:</strong> {quizStats.totalQuizzes}</div>
        <div><strong>Highest Score:</strong> {quizStats.highestScore}</div>
        <div className="badges-section">
          <strong>Badges Earned:</strong>
          {quizStats.badges.length === 0 ? (
            <span> None yet</span>
          ) : (
            <div className="badges-list">
              {quizStats.badges.map((badge, idx) => (
                <div className="badge" key={idx} title={badge.name || badge}>
                  <img
                    src={badge.icon || "/badge-default.svg"}
                    alt={badge.name || "Badge"}
                    className="badge-icon"
                  />
                  <span>{badge.name || badge}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quiz History Table */}
      {history.length === 0 ? (
        <p>You haven't played any quizzes yet.</p>
      ) : (
        <table className="quiz-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {history.map((quiz) => (
              <tr key={quiz._id}>
                <td>{new Date(quiz.timestamp || quiz.createdAt).toLocaleString()}</td>
                <td>{quiz.category}</td>
                <td>{quiz.difficulty}</td>
                <td>{quiz.score}</td>
                <td>{quiz.correctAnswers}</td>
                <td>{quiz.totalQuestions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizHistory;
