import QuizQuestion from "../models/QuizQuestion.js";
import QuizResult from "../models/QuizResult.js";
import User from "../models/User.js";
import QuizFeedback from '../models/QuizFeedback.js';



// =============================
// GET Quiz Questions (with filters)
// =============================
// GET Quiz Questions with Pagination
export const getQuizQuestions = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = new RegExp(`^${category}$`, "i");
    if (difficulty) filter.difficulty = new RegExp(`^${difficulty}$`, "i");

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [questions, total] = await Promise.all([
      QuizQuestion.find(filter).skip(skip).limit(parseInt(limit)),
      QuizQuestion.countDocuments(filter)
    ]);

    res.json({
      questions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =============================
// CREATE a New Question
// =============================
export const createQuizQuestion = async (req, res) => {
  try {
    const question = new QuizQuestion(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =============================
// GET Question by ID
// =============================
export const getQuizQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const question = await QuizQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    console.error("❌ getQuizQuestionById error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =============================
// UPDATE Question
// =============================
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

// =============================
// DELETE Question
// =============================
export const deleteQuizQuestion = async (req, res) => {
  try {
    const deleted = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// =============================
// SUBMIT Quiz Result + Update Stats
// =============================
export const submitQuizResult = async (req, res) => {
  try {
    const { userId, score, correctAnswers, totalQuestions, category, difficulty } = req.body;

    const result = new QuizResult({
      userId,
      score,
      correctAnswers,
      totalQuestions,
      category,
      difficulty,
    });

    const savedResult = await result.save(); // ✅ save and capture the saved result

    const user = await User.findById(userId);
    if (user) {
      // Update stats
      user.quizStats.totalQuizzes = (user.quizStats.totalQuizzes || 0) + 1;
      user.quizStats.highestScore = Math.max(user.quizStats.highestScore || 0, score);

      if (!user.quizStats.categoriesPlayed.includes(category)) {
        user.quizStats.categoriesPlayed.push(category);
      }

      // Assign badges
      const badges = [];
      if (user.quizStats.highestScore >= 3) badges.push({ name: "Gold", icon: "/badges/gold.svg" });
      else if (user.quizStats.highestScore >= 1) badges.push({ name: "Silver", icon: "/badges/silver.svg" });

      if (user.quizStats.categoriesPlayed.length >= 3) {
        badges.push({ name: "Explorer", icon: "/badges/explorer.svg" });
      }

      user.quizStats.badges = badges;
      await user.save();
    }

    // ✅ Return the new quiz result ID (quizId)
    res.status(201).json({
      message: "Quiz result saved",
      quizId: savedResult._id,
      updatedStats: user.quizStats,
    });
  } catch (err) {
    console.error("❌ Error in submitQuizResult:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================
// GET Leaderboard
// =============================
export const getLeaderboard = async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    const filter = {};

    if (category && category.trim() !== "") {
      filter.category = new RegExp(`^${category}$`, "i");
    }
    if (difficulty && difficulty.trim() !== "") {
      filter.difficulty = new RegExp(`^${difficulty}$`, "i");
    }

    const topResults = await QuizResult.find(filter)
      .sort({ score: -1, createdAt: 1 })
      .limit(10)
      .populate("userId", "username photo");

    res.json(topResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// GET User Quiz History
// =============================
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// Delete Results Older than 1 Month
// =============================
export const deleteOldQuizResults = async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await QuizResult.deleteMany({ createdAt: { $lt: oneMonthAgo } });
    console.log(`🧹 Deleted ${result.deletedCount} old quiz results`);
  } catch (err) {
    console.error("❌ Failed to delete old quiz results:", err);
  }
};



// =============================
// FEEDBACK FOR QUIZ
// =============================
export const submitFeedback = async (req, res) => {
  try {
    const { quizId, userId, rating, comment } = req.body;

    if (!quizId || !userId || !rating) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const feedback = new QuizFeedback({ quizId, userId, rating, comment });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllQuizFeedback = async (req, res) => {
  try {
    const feedbacks = await QuizFeedback.find()
      .populate('userId', 'fullname username ')  // select fields from User
      .populate('quizId', 'category difficulty score')           // select fields from Quiz
      .sort({ createdAt: -1 });                        // latest first

    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching quiz feedback:', err);
    res.status(500).json({ message: 'Server error fetching quiz feedback' });
  }
};

// =============================
// GET Feedback By Quiz Category
// =============================
export const getQuizFeedbackByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Find feedback where populated quizId's category matches requested category
    const feedbacks = await QuizFeedback.find()
      .populate('userId', 'fullname username')
      .populate({
        path: 'quizId',
        select: 'category',
        match: { category: new RegExp(`^${category}$`, 'i') },
      })
      .sort({ createdAt: -1 });

    // Filter out feedbacks whose quizId didn't match category (null)
    const filtered = feedbacks.filter(fb => fb.quizId !== null);

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching feedback by category:', err);
    res.status(500).json({ message: 'Server error fetching feedback by category' });
  }
};
