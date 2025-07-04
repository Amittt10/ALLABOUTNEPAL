import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizQuestionById, updateQuizQuestion } from '../../api/quizApi';
import './QuizEdit.css';

const QuizEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    category: '',
    difficulty: 'easy',
    explanation: '',
  });

  const categories = ["General", "Location", "History"];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuizQuestionById(id);
      setForm(data);
    } catch (err) {
      setError("Failed to fetch question data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    setSubmitError(null);
    try {
      await updateQuizQuestion(id, form);
      navigate('/admin/quiz');
    } catch {
      setSubmitError("Failed to update the question. Please try again.");
    }
  };

  if (loading) return <p>Loading question...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="quiz-edit-container">
      <h2>Edit Quiz Question</h2>
      {submitError && <p className="error">{submitError}</p>}
      <form onSubmit={handleSubmit} className="quiz-form">
        <label>Question</label>
        <textarea name="question" value={form.question} onChange={handleChange} required />

        {form.options.map((opt, i) => (
          <div key={i}>
            <label>Option {i + 1}</label>
            <input type="text" value={opt} onChange={(e) => handleChange(e, i)} required />
          </div>
        ))}

        <label>Correct Answer Index (0-3)</label>
        <input
          type="number"
          name="correctAnswerIndex"
          value={form.correctAnswerIndex}
          onChange={handleChange}
          min="0"
          max="3"
          required
        />

        <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>


        <label>Difficulty</label>
        <select name="difficulty" value={form.difficulty} onChange={handleChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label>Explanation (optional)</label>
        <textarea name="explanation" value={form.explanation} onChange={handleChange} />

        <button type="submit" className="submit-button">Update Question</button>
      </form>
    </div>
  );
};

export default QuizEdit;
