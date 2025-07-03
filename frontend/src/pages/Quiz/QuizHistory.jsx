import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./QuizHistory.css";

const QuizHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizStats, setQuizStats] = useState({
    totalQuizzes: 0,
    highestScore: 0,
    badges: [], // Assume badges are strings or objects with name and icon
  });

  useEffect(() => {
    const fetchHistoryAndStats = async () => {
      if (!user?._id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch quiz history
        const resHistory = await axios.get(
          `http://localhost:3000/api/quiz/user-progress/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(resHistory.data);

        // Fetch user quiz stats (you can create an API for this or get from user context)
        // For demo, use user.quizStats from context if available:
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
  }, [user]);

  if (loading) return <div className="quiz-history-container">Loading...</div>;

  if (error) return <div className="quiz-history-container error">{error}</div>;

  return (
    <div className="quiz-history-container">
      <h2>Your Quiz History</h2>

      {/* Summary */}
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
                  {/* You can customize badge icon if you have icons */}
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

      {/* History Table */}
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
              <th>Correct Answers</th>
              <th>Total Questions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((quiz) => (
              <tr key={quiz._id}>
                <td>{new Date(quiz.timestamp).toLocaleString()}</td>
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
