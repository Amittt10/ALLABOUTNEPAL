import express from 'express';
import {
  getQuizQuestions,
  getQuizQuestionById,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  submitQuizResult,
  getLeaderboard,
  getUserProgress,
  submitFeedback, 
  getAllQuizFeedback,
  getQuizFeedbackByCategory,
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/progress/:userId', getUserProgress);

router.get('/:id', getQuizQuestionById);
router.get('/', getQuizQuestions);
router.post('/', createQuizQuestion);
router.put('/:id', updateQuizQuestion);
router.delete('/:id', deleteQuizQuestion);

router.post('/submit', submitQuizResult);
router.post('/feedback', submitFeedback); 
router.get('/quiz-feedback', getAllQuizFeedback); // ✅ now publicly accessible

router.get('/feedback/category/:category', getQuizFeedbackByCategory);

export default router;
