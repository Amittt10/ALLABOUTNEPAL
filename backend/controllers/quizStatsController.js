// controllers/quizStatsController.js
import QuizResult from '../models/QuizResult.js';

export const getQuizStatistics = async (req, res) => {
  try {
    // Total quiz attempts
    const totalAttempts = await QuizResult.countDocuments();

    // Top scoring users - sum of scores, top 10
    const topUsers = await QuizResult.aggregate([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userName: "$user.fullname",
          totalScore: 1,
          attempts: 1
        }
      }
    ]);

    // Most played categories - count of attempts per category, top 10
    const mostPlayed = await QuizResult.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Average scores per category
    const averageScores = await QuizResult.aggregate([
      {
        $group: {
          _id: "$category",
          avgScore: { $avg: "$score" },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgScore: -1 } },
      {
        $project: {
          category: "$_id",
          avgScore: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalAttempts,
      topUsers,
      mostPlayed,
      averageScores,
    });
  } catch (err) {
    console.error("Quiz statistics error:", err);
    res.status(500).json({ message: "Failed to fetch quiz statistics" });
  }
};
