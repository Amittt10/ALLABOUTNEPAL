import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "./QuizPlay.css";

const QuizPlay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

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

  // Reset scroll on question change for better UX on small devices
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentIndex]);

  const handleAnswerSelect = (index) => setSelectedAnswer(index);

  const handleNext = () => {
    if (selectedAnswer === null) return;

    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = selectedAnswer;
      return newAnswers;
    });

    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinishNow = () => {
    // Save current answer if any selected
    const finalAnswers = [...userAnswers];
    if (selectedAnswer !== null) finalAnswers[currentIndex] = selectedAnswer;

    navigate("/quiz/result", { state: { questions, userAnswers: finalAnswers } });
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-play-container">
        <p>Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  return (
    <div className="quiz-play-container" role="main" aria-label="Quiz questions">
      <h2>
        Question {currentIndex + 1} of {questions.length}
      </h2>

      {/* Progress Bar */}
      <div className="progress-bar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100" role="progressbar">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <p className="quiz-question">{currentQuestion.question}</p>

      <div className="quiz-options">
        {currentQuestion.options.map((option, i) => (
          <button
            key={i}
            className={`quiz-option-btn ${selectedAnswer === i ? "selected" : ""}`}
            onClick={() => handleAnswerSelect(i)}
            aria-pressed={selectedAnswer === i}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="quiz-action-buttons">
        {/* Show Next if more questions */}
        {currentIndex + 1 < questions.length && (
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={selectedAnswer === null}
          >
            Next
          </button>
        )}

        {/* Finish Now button always visible */}
        <button
          className="btn-finish"
          onClick={handleFinishNow}
        >
          Finish Now
        </button>
      </div>
    </div>
  );
};

export default QuizPlay;
