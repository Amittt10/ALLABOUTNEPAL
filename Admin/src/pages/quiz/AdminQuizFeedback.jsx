import React, { useEffect, useState } from 'react';
import { api } from '../../api/axiosConfig';
import './AdminQuizFeedback.css';

const AdminQuizFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await api.getQuizFeedback();
        setFeedbacks(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch quiz feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) return <p className="loading">Loading feedback...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-feedback-container">
      <h2 className="page-title">Quiz Feedback</h2>

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback found.</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Quiz Info</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb._id}>
                <td>{fb.userId?.fullname || fb.userId?.username || 'Unknown User'}</td>
                <td>
                  {fb.quizId
                    ? `${fb.quizId.category || 'Unknown'} - ${fb.quizId.difficulty || ''} (Score: ${fb.quizId.score ?? 'N/A'})`
                    : 'Unknown Quiz'}
                </td>
                <td>{fb.rating}</td>
                <td>{fb.comment || '-'}</td>
                <td>{new Date(fb.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminQuizFeedback;
