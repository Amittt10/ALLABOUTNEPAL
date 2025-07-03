import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QuizResult.css';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, userAnswers } = location.state || {};

  if (!questions || !userAnswers) {
    return (
      <div className="quiz-result-container">
        <p>No results to show. Please take the quiz first.</p>
        <button onClick={() => navigate('/quiz')} className="btn-back">Go to Quiz Home</button>
      </div>
    );
  }

  // Calculate score
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.correctAnswerIndex) score++;
  });

  return (
    <div className="quiz-result-container">
      <h2>Quiz Results</h2>
      <p className="score-summary">Your score: {score} / {questions.length}</p>

      <div className="results-list">
        {questions.map((q, i) => {
          const userAnswerIndex = userAnswers[i];
          const isCorrect = userAnswerIndex === q.correctAnswerIndex;
          return (
            <div key={i} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
              <p className="result-question">{q.question}</p>
              <ul className="result-options">
                {q.options.map((opt, idx) => {
                  const isUser = idx === userAnswerIndex;
                  const isRight = idx === q.correctAnswerIndex;
                  return (
                    <li
                      key={idx}
                      className={`option-item
                        ${isRight ? 'correct-answer' : ''}
                        ${isUser && !isRight ? 'user-wrong' : ''}
                      `}
                    >
                      {opt}
                      {isRight && ' ✓'}
                      {isUser && !isRight && ' ✗'}
                    </li>
                  );
                })}
              </ul>
              {q.explanation && (
                <p className="explanation"><strong>Explanation:</strong> {q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => navigate('/quiz')} className="btn-back">Back to Quiz Home</button>
    </div>
  );
};

export default QuizResult;
