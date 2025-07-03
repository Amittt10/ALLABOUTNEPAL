import QuizQuestion from '../models/QuizQuestion.js';
import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';

// Get questions (filter by category/difficulty)
export const getQuizQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};

    // Make filtering case-insensitive using RegExp
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (difficulty) filter.difficulty = new RegExp(`^${difficulty}$`, 'i');

    const questions = await QuizQuestion.find(filter).limit(10); // limit if needed
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new question
export const createQuizQuestion = async (req, res) => {
  try {
    const question = new QuizQuestion(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a quiz question by ID
export const getQuizQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const question = await QuizQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    console.error("❌ Error in getQuizQuestionById:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update question
export const updateQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete question
export const deleteQuizQuestion = async (req, res) => {
  try {
    const deleted = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Submit quiz result
export const submitQuizResult = async (req, res) => {
  try {
    const { userId, score, correctAnswers, totalQuestions, category, difficulty } = req.body;

    const result = new QuizResult({ userId, score, correctAnswers, totalQuestions, category, difficulty });
    await result.save();

    const user = await User.findById(userId);
    if (user) {
      user.quizStats.totalQuizzes = (user.quizStats.totalQuizzes || 0) + 1;
      user.quizStats.highestScore = Math.max(user.quizStats.highestScore || 0, score);
      if (!user.quizStats.categoriesPlayed.includes(category)) {
        user.quizStats.categoriesPlayed.push(category);
      }
      await user.save();
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get leaderboard (top scores)
 export const getLeaderboard = async (req, res) => {
  try {
    
    const { category, difficulty } = req.query;
    const filter = {};

    if (category && category.trim() !== "") {
      filter.category = new RegExp(`^${category}$`, 'i');
    }
    if (difficulty && difficulty.trim() !== "") {
      filter.difficulty = new RegExp(`^${difficulty}$`, 'i');
    }

    const topResults = await QuizResult.find(filter)
      .sort({ score: -1, createdAt: 1 })
      .limit(10)
      .populate('userId', 'username photo');

    res.json(topResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get user progress
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId }).sort({ timestamp: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
