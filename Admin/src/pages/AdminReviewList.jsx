import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./AdminReviewList.css";

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews/admin");
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="admin-review-page">
      <h2>User Reviews (All)</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Type</th>
              <th>Target Title / ID</th>
              <th>Replies</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id}>
                <td>{r.userId?.username || "Anonymous"}</td>
                <td>{r.rating}★</td>
                <td>{r.comment}</td>
                <td>{r.targetType}</td>
                <td>{r.targetTitle || r.targetId}</td>
                <td>{r.replies?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviewList;
