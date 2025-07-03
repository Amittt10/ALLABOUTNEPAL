import express from 'express';
import {
  getQuizQuestions,
  getQuizQuestionById, // ✅ import this function
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  submitQuizResult,
  getLeaderboard,
  getUserProgress,
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/', getQuizQuestions);
router.get('/:id', getQuizQuestionById); // ✅ ← this was missing
router.post('/', createQuizQuestion);
router.put('/:id', updateQuizQuestion);
router.delete('/:id', deleteQuizQuestion);

router.post('/submit', submitQuizResult);
router.get('/leaderboard', getLeaderboard);
router.get('/progress/:userId', getUserProgress);

export default router;
