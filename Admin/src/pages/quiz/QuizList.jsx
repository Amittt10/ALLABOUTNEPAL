import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuizQuestions, deleteQuizQuestion } from '../../api/quizApi';
import './QuizList.css';

const QuizList = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [limit] = useState(10); // You can change this to allow dynamic page size

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllQuizQuestions({ page, limit });
      setQuestions(res.questions);
      setPages(res.pages);
    } catch (err) {
      setError("Failed to load quiz questions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await deleteQuizQuestion(id);
      fetchQuestions();
    } catch {
      alert("Failed to delete the question. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="quiz-list-container">
      <h2>Quiz Questions</h2>
      <Link to="/admin/quiz/add" className="add-button">+ Add Question</Link>

      {questions.length === 0 ? (
        <p>No quiz questions available.</p>
      ) : (
        <>
          <table className="quiz-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q._id}>
                  <td>{(page - 1) * limit + index + 1}</td> {/* Correct numbering */}
                  <td>{q.question}</td>
                  <td>{q.category}</td>
                  <td>{q.difficulty}</td>
                  <td>
                    <Link to={`/admin/quiz/edit/${q._id}`} className="edit">Edit</Link>
                    <button onClick={() => handleDelete(q._id)} className="delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Prev</button>
            <span>Page {page} of {pages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === pages}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizList;
