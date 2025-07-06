import User from '../models/User.js';
import QuizResult from '../models/QuizResult.js';

// Assuming you use native MongoDB driver for heritage and festivals collections:
export const getStats = async (req, res) => {
  try {
    const db = req.db; // your middleware must attach req.db with collections
    const heritageCollection = db.heritageCollection;
    const festivalCollection = db.festivalCollection;

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    // Total users
    const totalUsers = await User.countDocuments();

    // Users registered before 7 days ago
    const prevUsers = await User.countDocuments({ createdAt: { $lt: sevenDaysAgo } });

    const userGrowth = prevUsers === 0 ? 100 : ((totalUsers - prevUsers) / prevUsers) * 100;

  const activeUsers = await User.countDocuments({
  lastLogin: { $gte: sevenDaysAgo },
});


    // Active users 7–14 days ago
    const prevActiveUsers = await User.countDocuments({
      $or: [
        { updatedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } },
        { createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } },
      ],
    });

    const activeUserGrowth =
      prevActiveUsers === 0
        ? 100
        : ((activeUsers - prevActiveUsers) / prevActiveUsers) * 100;

    // Total heritage sites
    const totalSites = await heritageCollection.countDocuments();

    // Heritage sites created before 7 days ago
    const prevSites = await heritageCollection.countDocuments({ createdAt: { $lt: sevenDaysAgo } });

    const heritageGrowth = prevSites === 0 ? 100 : ((totalSites - prevSites) / prevSites) * 100;

    // Active heritage sites
    const activeSites = await heritageCollection.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Pending and inactive sites
    const pendingSites = await heritageCollection.countDocuments({ status: 'pending' });
    const inactiveSites = await heritageCollection.countDocuments({ status: 'inactive' });

    // Total festivals
    const totalFestivals = await festivalCollection.countDocuments();

    const prevFestivals = await festivalCollection.countDocuments({ createdAt: { $lt: sevenDaysAgo } });

    const festivalGrowth = prevFestivals === 0 ? 100 : ((totalFestivals - prevFestivals) / prevFestivals) * 100;

    // Quiz attempts
    const totalQuizAttempts = await QuizResult.countDocuments();
    const prevQuizAttempts = await QuizResult.countDocuments({ createdAt: { $lt: sevenDaysAgo } });

    const quizGrowth = prevQuizAttempts === 0 ? 100 : ((totalQuizAttempts - prevQuizAttempts) / prevQuizAttempts) * 100;

    // Average quiz score
    const aggAvgScore = await QuizResult.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } },
    ]);
    const averageScore = aggAvgScore.length ? aggAvgScore[0].avgScore : 0;

    // Recent heritage sites (last 5)
    const recentSites = await heritageCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Recent user registrations (last 5)
    const recentUserRegistrations = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullname createdAt')
      .lean();

    // Recent quiz attempts (last 5)
    const recentQuizAttemptsRaw = await QuizResult.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullname')
      .lean();

    const recentQuizAttempts = recentQuizAttemptsRaw.map((attempt) => ({
      _id: attempt._id,
      userName: attempt.userId?.fullname || 'Unknown',
      score: attempt.score,
      quizTitle: attempt.category || 'General',
      attemptDate: attempt.createdAt,
    }));

    // Final response
    res.json({
      totalUsers,
      userGrowth: userGrowth.toFixed(2),
      activeUsers,
      activeUserGrowth: activeUserGrowth.toFixed(2),

      totalSites,
      heritageGrowth: heritageGrowth.toFixed(2),
      activeSites,
      pendingSites,
      inactiveSites,

      totalFestivals,
      festivalGrowth: festivalGrowth.toFixed(2),

      quizStats: {
        totalAttempts: totalQuizAttempts,
        quizGrowth: quizGrowth.toFixed(2),
        averageScore: averageScore.toFixed(1),
      },

      recentSites,
      recentUserRegistrations,
      recentQuizAttempts,
    });
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
