import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import "./ReviewSection.css";

const ReviewItem = ({ review, onReplySubmit }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const toggleReplyBox = () => setShowReplyBox((prev) => !prev);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return alert("Please enter a reply.");
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
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // reviews per page

 const fetchReviews = async (pageNumber = 1) => {
  console.log(`Fetching reviews for page ${pageNumber}...`);
  try {
    const res = await api.get(
      `/reviews/${targetType}/${targetId}?page=${pageNumber}&limit=${limit}`
    );

    setReviews(res.data.reviews || res.data);
    setAverage(res.data.averageRating || 0);
    setTotal(res.data.totalReviews || (res.data.reviews ? res.data.reviews.length : 0));
    setPage(res.data.page || pageNumber);
    setTotalPages(res.data.totalPages || 1);
  } catch (err) {
    console.error("Error loading reviews", err);
    setReviews([]);
    setAverage(0);
    setTotal(0);
    setPage(1);
    setTotalPages(1);
  }
};


  useEffect(() => {
    if (targetType && targetId) {
      fetchReviews(page);
    }
  }, [targetType, targetId, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Please write a comment before submitting.");
    try {
      await api.post("/reviews", { targetType, targetId, rating, comment });
      setRating(5);
      setComment("");
      fetchReviews(1);
      setPage(1);
    } catch (err) {
      alert("Please login to submit a review.");
    }
  };

  const submitReply = async (reviewId, replyComment) => {
    try {
      await api.post(`/reviews/${reviewId}/replies`, { comment: replyComment });
      fetchReviews(page);
    } catch (err) {
      alert("Please login to reply.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  // For pagination buttons, display max 5 pages around current
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
    <div className="review-section">
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <div className="stars" aria-label="Rating selector">
            {[5, 4, 3, 2, 1].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? "filled" : ""}`}
                onClick={() => setRating(star)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setRating(star)}
                aria-pressed={rating === star}
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
          aria-label="Review comment"
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
        <nav className="pagination" aria-label="Review pages pagination">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Previous page"
          >
            &laquo; Prev
          </button>
          {getPaginationButtons().map((num) => (
            <button
              key={num}
              className={num === page ? "active" : ""}
              onClick={() => handlePageChange(num)}
              aria-current={num === page ? "page" : undefined}
            >
              {num}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            aria-label="Next page"
          >
            Next &raquo;
          </button>
        </nav>
      )}
    </div>
  );
};

export default ReviewSection;
