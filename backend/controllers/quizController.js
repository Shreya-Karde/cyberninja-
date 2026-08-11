const Question   = require('../models/Question');
const QuizResult = require('../models/QuizResult');
const User       = require('../models/User');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// GET /api/questions
exports.getQuestions = async (req, res) => {
  try {
    const { category, level, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (level) filter.level = level;

    const raw = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } },
    ]);

    const questions = raw.map(doc => {
      const indices  = [0, 1, 2, 3].slice(0, doc.options.length);
      const shuffled = shuffle(indices);
      const newCorrect = shuffled.indexOf(doc.correctAnswer);
      return {
        ...doc,
        options:       shuffled.map(i => doc.options[i]),
        correctAnswer: newCorrect,
        _optionMap:    shuffled,
      };
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/quiz/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { category, level, mode, answers, timeTaken } = req.body;
    const userId = req.user._id;

    let correct = 0;
    const processedAnswers = [];

    // Track which actual question categories were answered
    const categoryCorrectMap = {};
    const categoryTotalMap   = {};

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);
      if (!question) continue;

      let selectedOriginal = ans.selectedAnswer;
      if (Array.isArray(ans.optionMap) && ans.optionMap.length > 0
          && ans.selectedAnswer >= 0 && ans.selectedAnswer < ans.optionMap.length) {
        selectedOriginal = ans.optionMap[ans.selectedAnswer];
      }

      const isCorrect = selectedOriginal === question.correctAnswer;
      if (isCorrect) correct++;

      // Track per-category breakdown using ACTUAL question category
      const qCat = question.category || 'general';
      if (!categoryTotalMap[qCat])   categoryTotalMap[qCat]   = 0;
      if (!categoryCorrectMap[qCat]) categoryCorrectMap[qCat] = 0;
      categoryTotalMap[qCat]++;
      if (isCorrect) categoryCorrectMap[qCat]++;

      processedAnswers.push({
        questionId:     question._id,
        selectedAnswer: ans.selectedAnswer,
        isCorrect,
        timeTaken:      ans.timeTaken || 0,
      });
    }

    const total    = processedAnswers.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const pointsMap = { beginner: 10, intermediate: 20, expert: 30 };
    const pts       = pointsMap[level] || 10;
    const score     = correct * pts;

    const result = await QuizResult.create({
      user:           userId,
      category:       category || 'all',
      level:          level    || 'beginner',
      mode:           mode     || 'practice',
      score,
      totalQuestions: total,
      correctAnswers: correct,
      accuracy,
      timeTaken,
      answers:        processedAnswers,
    });

    // ── Update user stats ────────────────────────────────────────────────
    const user = await User.findById(userId);

    user.quizzesTaken += 1;
    user.totalScore   += score;

    // Update categoryStats using ACTUAL per-question categories
    if (!user.categoryStats) user.categoryStats = new Map();

    Object.keys(categoryTotalMap).forEach(cat => {
      const prev = user.categoryStats.get(cat) || { correct: 0, total: 0 };
      prev.correct += categoryCorrectMap[cat] || 0;
      prev.total   += categoryTotalMap[cat];
      user.categoryStats.set(cat, prev);
    });

    // Weak categories (< 60% accuracy, min 3 questions attempted)
    const weak = [];
    user.categoryStats.forEach((s, cat) => {
      if (s.total >= 3 && (s.correct / s.total) * 100 < 60) weak.push(cat);
    });
    user.weakCategories = weak;

    // Recalculate overall accuracy from all results
    const allResults   = await QuizResult.find({ user: userId });
    const totalCorrect = allResults.reduce((s, r) => s + r.correctAnswers, 0);
    const totalQs      = allResults.reduce((s, r) => s + r.totalQuestions, 0);
    user.accuracy      = totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0;

    // ── Badge rules (easier thresholds so they actually trigger) ─────────
    const addBadge = (name) => {
      if (!user.badges.find(b => b.name === name))
        user.badges.push({ name, earnedAt: new Date() });
    };

    // First quiz ever
    if (user.quizzesTaken >= 1)  addBadge('First Quiz');
    // 50+ total points
    if (user.totalScore >= 50)   addBadge('Point Scorer');
    // 80%+ accuracy on this quiz
    if (accuracy >= 80)          addBadge('Sharp Mind');
    // 5 quizzes completed
    if (user.quizzesTaken >= 5)  addBadge('Dedicated');
    // 100% accuracy on this quiz
    if (accuracy === 100)        addBadge('Perfectionist');
    // 200+ total points
    if (user.totalScore >= 200)  addBadge('Centurion');
    // 10 quizzes completed
    if (user.quizzesTaken >= 10) addBadge('Veteran');
    // 500+ total points
    if (user.totalScore >= 500)  addBadge('Elite');

    await user.save();

    // Return plain object so Map serializes correctly
    const savedUser = await User.findById(userId).select('-password');
    const userData  = savedUser.toObject();

    res.json({
      result,
      accuracy,
      score,
      correct,
      total,
      timeTaken,
      category:       category || 'all',
      level:          level    || 'beginner',
      mode:           mode     || 'practice',
      feedback:       buildFeedback(category, accuracy),
      weakCategories: userData.weakCategories,
      badges:         userData.badges,
      categoryStats:  userData.categoryStats,
      totalScore:     userData.totalScore,
      quizzesTaken:   userData.quizzesTaken,
      overallAccuracy: userData.accuracy,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/quiz/history
exports.getHistory = async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(20);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

function buildFeedback(category, accuracy) {
  const names = {
    phishing: 'phishing detection', password: 'password security',
    'social-engineering': 'social engineering', network: 'network security',
    malware: 'malware awareness', browsing: 'safe browsing',
    mobile: 'mobile security', privacy: 'data privacy',
    payments: 'digital payment safety', 'cyber-laws': 'cyber law awareness',
    all: 'cybersecurity',
  };
  const name = names[category] || category || 'cybersecurity';
  if (accuracy >= 90) return `🏆 Excellent! You have mastered ${name}.`;
  if (accuracy >= 70) return `✅ Good work on ${name}. Keep practising to reach expert level.`;
  if (accuracy >= 50) return `⚠️ You need improvement in ${name}. Review the learning articles.`;
  return `🚨 Critical gap in ${name}. Please study the articles and retry this quiz.`;
}