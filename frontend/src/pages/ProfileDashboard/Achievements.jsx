import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/api";
import { deriveAchievements } from "../../utils/deriveAchievements";
import "./Achievements.css";

const Achievements = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [quizStats, setQuizStats] = useState({ badges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user?._id) return;

      try {
        const res = await api.getUserProgress(user._id);
        setHistory(res.data || []);

        if (user.quizStats) {
          setQuizStats({
            totalQuizzes: user.quizStats.totalQuizzes || 0,
            highestScore: user.quizStats.highestScore || 0,
            badges: user.quizStats.badges || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load achievements.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const achievements = deriveAchievements(history, quizStats);

  if (loading) return <div className="achievements-section">Loading achievements...</div>;
  if (error) return <div className="achievements-section error">{error}</div>;

  return (
    <div className="achievements-section">
      <h3>Achievements</h3>
      <div className="achievements-list">
        {achievements.map(({ id, name, earned, dateEarned, icon, progress, target }) => (
          <div
            key={id}
            className={`achievement ${earned ? "earned" : "locked"}`}
            title={
              earned
                ? dateEarned
                  ? `Earned on ${new Date(dateEarned).toLocaleDateString()}`
                  : "Earned"
                : "Locked"
            }
          >
            <img src={icon} alt={name} className="achievement-icon" />
            <div className="achievement-name">{name}</div>
            {progress !== undefined && target !== undefined && !earned && (
              <div className="achievement-progress">
                {progress} / {target}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
