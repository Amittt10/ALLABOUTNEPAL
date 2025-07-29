export const deriveAchievements = (history, quizStats = {}) => {
  const achievements = [];

  // First Quiz Played
  achievements.push({
    id: "first_quiz",
    name: "First Quiz Played",
    earned: history.length > 0,
    dateEarned: history[0]?.timestamp || history[0]?.createdAt || null,
    icon: "/badges/first-quiz.svg",
  });

  // Played 10 Quizzes
  achievements.push({
    id: "quiz_enthusiast",
    name: "Quiz Enthusiast",
    earned: history.length >= 10,
    progress: history.length,
    target: 10,
    dateEarned: history[9]?.timestamp || history[9]?.createdAt || null,
    icon: "/badges/enthusiast.svg",
  });

  // Scored 90+ on any quiz
  const highScore = history.find(q => q.score >= 90);
  achievements.push({
    id: "high_scorer",
    name: "High Scorer",
    earned: !!highScore,
    dateEarned: highScore?.timestamp || highScore?.createdAt || null,
    icon: "/badges/high-score.svg",
  });

  // Perfect Score
  const perfect = history.find(q => q.score === q.totalQuestions);
  achievements.push({
    id: "perfect_score",
    name: "Perfect Score",
    earned: !!perfect,
    dateEarned: perfect?.timestamp || perfect?.createdAt || null,
    icon: "/badges/perfect-score.svg",
  });

  // 5 Quizzes in last 7 days
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recent = history.filter(q => new Date(q.timestamp || q.createdAt) >= weekAgo);
  achievements.push({
    id: "consistency",
    name: "Consistency",
    earned: recent.length >= 5,
    progress: recent.length,
    target: 5,
    dateEarned: recent[4]?.timestamp || recent[4]?.createdAt || null,
    icon: "/badges/consistency.svg",
  });

  // Custom badges (if any)
  if (quizStats.badges) {
    quizStats.badges.forEach(badge => {
      achievements.push({
        id: `badge_${badge.name.toLowerCase().replace(/\s+/g, "_")}`,
        name: badge.name,
        earned: true,
        icon: badge.icon || "/badges/default.svg",
      });
    });
  }

  return achievements;
};
