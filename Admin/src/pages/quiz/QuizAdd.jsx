import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuizQuestion } from '../../api/quizApi';
import './QuizAdd.css';

const QuizAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    category: 'General',
    difficulty: 'easy',
    explanation: '',
  });

  const categories = ["General", "Location", "History"]; // 🔸 Define locally
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, i = null) => {
    if (i !== null) {
      const newOptions = [...form.options];
      newOptions[i] = e.target.value;
      setForm({ ...form, options: newOptions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createQuizQuestion(form);
      navigate('/admin/quiz');
    } catch (err) {
      console.error("Error adding quiz question:", err);
      setError("Failed to add question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-add-container">
      <h2>Add Quiz Question</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="quiz-form">
        <label>Question</label>
        <textarea
          name="question"
          value={form.question}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {form.options.map((opt, i) => (
          <div key={i}>
            <label>Option {i + 1}</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleChange(e, i)}
              required
              disabled={loading}
            />
          </div>
        ))}

        <label>Correct Answer Index (0–3)</label>
        <input
          type="number"
          name="correctAnswerIndex"
          value={form.correctAnswerIndex}
          onChange={handleChange}
          min="0"
          max="3"
          required
          disabled={loading}
        />

        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          disabled={loading}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Difficulty</label>
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label>Explanation (optional)</label>
        <textarea
          name="explanation"
          value={form.explanation}
          onChange={handleChange}
          disabled={loading}
        />

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding..." : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default QuizAdd;
