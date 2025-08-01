import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { showCustomToast } from "../../pages/utils/showCustomToast";
import "./ReviewSection.css";

const ReviewItem = ({ review, onReplySubmit }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const toggleReplyBox = () => setShowReplyBox((prev) => !prev);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      showCustomToast("⚠️ REPLY_REQUIRED", "Please enter a reply.");
      return;
    }
    await onReplySubmit(review._id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <li className="review-item">
      <strong>{review.userId?.username || "User"}</strong> rated {review.rating} ★
      <p>{review.comment}</p>

      {review.replies && review.replies.length > 0 && (
        <ul className="reply-list">
          {review.replies.map((reply) => (
            <li key={reply._id} className="reply-item">
              <strong>{reply.userId?.username || "User"}</strong>: {reply.comment}
            </li>
          ))}
        </ul>
      )}

      <button className="reply-btn" onClick={toggleReplyBox}>
        {showReplyBox ? "Cancel" : "Reply"}
      </button>

      {showReplyBox && (
        <div className="reply-form">
          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            autoFocus
          />
          <button onClick={handleSubmitReply}>Submit Reply</button>
        </div>
      )}
    </li>
  );
};

const ReviewSection = ({ targetType, targetId }) => {
  const { user, ready } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const navigate = useNavigate();
  const location = useLocation();

  // Restore saved review form after login redirect
  useEffect(() => {
    if (location.state?.reviewForm) {
      const { rating: savedRating, comment: savedComment } = location.state.reviewForm;
      setRating(savedRating || 0);
      setComment(savedComment || "");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const fetchReviews = async (pageNumber = 1) => {
    try {
      const res = await api.get(
        `/reviews/${targetType}/${targetId}?page=${pageNumber}&limit=${limit}`
      );
      setReviews(res.data.reviews || res.data);
      setAverage(res.data.averageRating || 0);
      setTotal(res.data.totalReviews || 0);
      setPage(res.data.page || pageNumber);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      showCustomToast("❌ FETCH_FAILED", "Could not load reviews.");
    }
  };

  useEffect(() => {
    if (targetType && targetId) {
      fetchReviews(page);
    }
  }, [targetType, targetId, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ready) return;

    if (!user) {
      showCustomToast(
        "⚠️ UNAUTHORIZED",
        "Please login to submit a review.",
        "Login",
        "/login",
        () =>
          navigate("/login", {
            state: {
              from: location,
              reviewForm: { rating, comment },
            },
          })
      );
      return;
    }

    if (!comment.trim()) {
      showCustomToast("⚠️ COMMENT_REQUIRED", "Please write a comment before submitting.");
      return;
    }

    try {
      await api.post("/reviews", { targetType, targetId, rating, comment });
      setRating(0);
      setComment("");
      fetchReviews(1);
      setPage(1);
      showCustomToast("✅ REVIEW_ADDED", "Thank you for your review!");
    } catch (err) {
      showCustomToast("❌ FAILED", "Could not submit review.");
    }
  };

  const submitReply = async (reviewId, replyComment) => {
    if (!ready) return;

    if (!user) {
      showCustomToast(
        "⚠️ UNAUTHORIZED",
        "Please login to reply.",
        "Login",
        "/login",
        () =>
          navigate("/login", {
            state: {
              from: location,
              reviewForm: { rating, comment },
            },
          })
      );
      return;
    }

    try {
      await api.post(`/reviews/${reviewId}/replies`, { comment: replyComment });
      fetchReviews(page);
      showCustomToast("✅ REPLY_ADDED", "Reply submitted successfully.");
    } catch (err) {
      showCustomToast("❌ FAILED", "Could not submit reply.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    return buttons;
  };

  return (
    <div className="review-container">
      <div className="review-section">
        <h3>Leave a Review</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    hoveredStar >= star || rating >= star ? "filled" : ""
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                >
                  ★
                </span>
              ))}
            </div>
          </label>
          <textarea
            required
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            Submit Review
          </button>
        </form>

        <h4>
          All Reviews ({total}) — Avg: {average.toFixed(1)} ★
        </h4>

        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <ul className="review-list">
            {reviews.map((r) => (
              <ReviewItem key={r._id} review={r} onReplySubmit={submitReply} />
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              &laquo; Prev
            </button>
            {getPaginationButtons().map((num) => (
              <button
                key={num}
                className={num === page ? "active" : ""}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next &raquo;
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
