const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('username totalScore quizzesTaken accuracy badges level')
      .sort({ totalScore: -1 })
      .limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
