import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "./QuizResult.css";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, userAnswers, quizId, userId } = location.state || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [publicFeedbacks, setPublicFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  if (!questions || !userAnswers) {
    return (
      <div className="quiz-result-container">
        <p>No results to show. Please take the quiz first.</p>
        <button onClick={() => navigate("/quiz")} className="btn-back">
          Go to Quiz Home
        </button>
      </div>
    );
  }

  const answeredQuestions = questions.filter((_, i) => userAnswers[i] !== undefined);

  let score = 0;
  answeredQuestions.forEach((q, i) => {
    if (userAnswers[i] === q.correctAnswerIndex) score++;
  });

  const category = questions[0]?.category || "";

  useEffect(() => {
    if (!category) return;

    const fetchPublicFeedback = async () => {
      try {
        setLoadingFeedback(true);
        const res = await api.getQuizFeedbackByCategory(category);
        setPublicFeedbacks(res.data);
      } catch (error) {
        console.error("Failed to load public feedback:", error);
        setPublicFeedbacks([]);
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchPublicFeedback();
  }, [category]);

  // Calculate average rating
  const totalFeedbackCount = publicFeedbacks.length;
  const averageRating =
    totalFeedbackCount > 0
      ? (
          publicFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedbackCount
        ).toFixed(1)
      : 0;

  // Render stars for average rating and individual feedbacks
  const renderStars = (ratingValue, onClick = null) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= ratingValue ? "filled" : ""}`}
        aria-hidden="true"
        style={{ color: i <= ratingValue ? "#FFD700" : "#ccc", cursor: onClick ? "pointer" : "default" }}
        onClick={() => onClick && onClick(i)}
      >
        ★
      </span>
    );
  }
  return (
    <span className="star-rating" aria-label={`${ratingValue} out of 5 stars`}>
      {stars}
    </span>
  );
};


  const handleSubmitFeedback = async () => {
    if (!rating) {
      setFeedbackStatus("Please select a rating.");
      return;
    }
    if (!quizId || !userId) {
      setFeedbackStatus("Missing quiz or user info. Please retry.");
      return;
    }

    try {
      await api.submitQuizFeedback({
        quizId,
        userId,
        rating,
        comment,
      });

      setFeedbackStatus("✅ Thank you for your feedback!");
      setRating(0);
      setComment("");
      // Refresh feedback list after submit
      const res = await api.getQuizFeedbackByCategory(category);
      setPublicFeedbacks(res.data);

      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackStatus("");
      }, 2000);
    } catch (error) {
      console.error("Feedback error:", error);
      setFeedbackStatus("❌ Failed to submit feedback. Please try again later.");
    }
  };

  const handleModalClick = (e) => {
    if (e.target.classList.contains("feedback-modal-overlay")) {
      setShowFeedbackModal(false);
      setFeedbackStatus("");
    }
  };

  return (
    <div className="quiz-result-container">
      <h2>Quiz Results</h2>
      <p className="score-summary">
        Your score: {score} / {answeredQuestions.length}
      </p>

      <div className="results-list">
        {answeredQuestions.map((q, i) => {
          const userAnswerIndex = userAnswers[i];
          const isCorrect = userAnswerIndex === q.correctAnswerIndex;
          return (
            <div key={i} className={`result-item ${isCorrect ? "correct" : "incorrect"}`}>
              <p className="result-question">{q.question}</p>
              <ul className="result-options">
                {q.options.map((opt, idx) => {
                  const isUser = idx === userAnswerIndex;
                  const isRight = idx === q.correctAnswerIndex;
                  return (
                    <li
                      key={idx}
                      className={`option-item
                        ${isRight ? "correct-answer" : ""}
                        ${isUser && !isRight ? "user-wrong" : ""}
                      `}
                    >
                      {opt}
                      {isRight && " ✓"}
                      {isUser && !isRight && " ✗"}
                    </li>
                  );
                })}
              </ul>
              {q.explanation && (
                <p className="explanation">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Public feedback section */}
      <div className="public-feedback-section">
        {/* <h3>What others say about "{category}" quizzes</h3> */}
        {loadingFeedback ? (
          <p>Loading feedback...</p>
        ) : totalFeedbackCount === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          <>
            <div className="average-rating-summary" style={{ marginBottom: "15px" }}>
              <strong>Average Rating: </strong>
              {renderStars(Math.round(averageRating))}
              <span> ({averageRating} / 5)</span>
              <br />
              <small>
                {totalFeedbackCount} {totalFeedbackCount === 1 ? "review" : "reviews"}
              </small>
            </div>

            <ul className="public-feedback-list">
              {publicFeedbacks.map((fb) => (
                <li key={fb._id} className="public-feedback-item">
                  <div className="feedback-header">
                    <strong>{fb.userId?.fullname || fb.userId?.username || "Anonymous"}</strong>{" "}
                    {renderStars(fb.rating)}
                  </div>
                  <div className="feedback-comment">{fb.comment || <em>No comment provided.</em>}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {!showFeedbackModal && (
        <button
          className="btn-open-feedback"
          onClick={() => setShowFeedbackModal(true)}
          aria-label="Open feedback form"
        >
          Give Feedback
        </button>
      )}

      {showFeedbackModal && (
        <div className="feedback-modal-overlay" onClick={handleModalClick} role="dialog" aria-modal="true">
          <div className="feedback-modal">
            <button className="modal-close-btn" onClick={() => setShowFeedbackModal(false)} aria-label="Close feedback form">
              &times;
            </button>
            <h3>We'd love your feedback!</h3>

            <label>Rating:</label>
            <div>{renderStars(rating, setRating)}</div>

            <label htmlFor="feedback-comment">Comments (optional):</label>
            <textarea
              id="feedback-comment"
              placeholder="Write your thoughts here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button onClick={handleSubmitFeedback} className="btn-submit-feedback">
              Submit Feedback
            </button>

            {feedbackStatus && <p className="feedback-status">{feedbackStatus}</p>}
          </div>
        </div>
      )}

      <button onClick={() => navigate("/quiz")} className="btn-back">
        Back to Quiz Home
      </button>
    </div>
  );
};

export default QuizResult;
