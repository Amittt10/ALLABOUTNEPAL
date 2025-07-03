import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/api";
import "./QuizPlay.css";

const QuizPlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  const { user } = useContext(AuthContext);

  const TIMER_SECONDS = 15;
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);

  // Fetch questions once on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.getQuizQuestions(category, difficulty);
        if (res.data.length === 0) {
          alert("No questions found for the selected category/difficulty.");
          navigate("/quiz");
          return;
        }
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, [category, difficulty, navigate]);

  // Timer effect: reset timer and start countdown on currentIndex change
  useEffect(() => {
    setTimeLeft(TIMER_SECONDS);
    setSelectedAnswer(null);
    setShowFeedback(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  // When timer hits zero, auto-submit and move on
  useEffect(() => {
    if (timeLeft <= 0 && !showFeedback) {
      clearInterval(timerRef.current);

      // Save answer (or null if none selected)
      const answerToSave = selectedAnswer !== null ? selectedAnswer : null;
      setUserAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentIndex] = answerToSave;
        return newAnswers;
      });

      setShowFeedback(true);

      // Show feedback briefly, then move to next question or results
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          submitResultAndNavigate([...userAnswers, answerToSave]);
        }
      }, 1500);
    }
  }, [timeLeft, showFeedback, selectedAnswer, currentIndex, questions, userAnswers]);

  const handleAnswerSelect = (index) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    clearInterval(timerRef.current);

    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = selectedAnswer;
      return newAnswers;
    });

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitResultAndNavigate(userAnswers);
    }
  };

  const handleFinishNow = () => {
    setShowFinishConfirm(true);
  };

  // New function: submit quiz result to backend and navigate to results page
  const submitResultAndNavigate = async (finalAnswers) => {
    if (!user) {
      alert("Please login to save your quiz results.");
      navigate("/login");
      return;
    }

    // Calculate correct answers count
    const correctAnswersCount = finalAnswers.reduce((acc, answer, idx) => {
      if (questions[idx]?.correctAnswerIndex === answer) return acc + 1;
      return acc;
    }, 0);

    try {
      await api.submitQuizResult({
        userId: user._id,
        score: correctAnswersCount,
        correctAnswers: correctAnswersCount,
        totalQuestions: questions.length,
        category,
        difficulty,
      });

      // Navigate after successful submission
      navigate("/quiz/result", { state: { questions, userAnswers: finalAnswers } });
    } catch (error) {
      console.error("Failed to submit quiz result:", error);
      alert("Failed to save your quiz result. Please try again.");
    }
  };

  // Confirm finish button logic
  const confirmFinishNow = () => {
    let finalAnswers = [...userAnswers];
    if (selectedAnswer !== null && !showFeedback) {
      finalAnswers[currentIndex] = selectedAnswer;
    }
    submitResultAndNavigate(finalAnswers);
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-play-container">
        <p>Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="quiz-play-container">
      <h2>
        Question {currentIndex + 1} of {questions.length}
      </h2>

      <div className="timer">
        <div
          className="timer-progress"
          style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
        ></div>
      </div>
      <div className="timer-text">Time left: {timeLeft}s</div>

      <p className="quiz-question">{currentQuestion.question}</p>

      <div className="quiz-options">
        {currentQuestion.options.map((option, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = currentQuestion.correctAnswerIndex === i;

          let className = "quiz-option-btn";
          if (showFeedback) {
            if (isCorrect) className += " correct";
            else if (isSelected && !isCorrect) className += " incorrect";
            else className += " disabled";
          } else if (isSelected) {
            className += " selected";
          }

          return (
            <button
              key={i}
              className={className}
              onClick={() => handleAnswerSelect(i)}
              disabled={showFeedback}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFinishConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Are you sure you want to finish the quiz?</h3>
            <p>Your progress will be submitted and you'll see your results.</p>
            <div className="modal-actions">
              <button onClick={confirmFinishNow} className="btn-confirm">Yes, Finish</button>
              <button onClick={() => setShowFinishConfirm(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="quiz-action-buttons">
        {!showFeedback ? (
          <button
            className="btn-submit"
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
        ) : (
          <button className="btn-next" onClick={handleNext}>
            {currentIndex + 1 === questions.length ? "See Results" : "Next Question"}
          </button>
        )}

        <button className="btn-finish" onClick={handleFinishNow}>
          Finish Now
        </button>
      </div>
    </div>
  );
};

export default QuizPlay;
