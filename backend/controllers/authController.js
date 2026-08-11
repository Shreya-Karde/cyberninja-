const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  try {
    const { username, email, password, language, level } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const user  = await User.create({ username, email, password, language, level });
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id, username: user.username, email: user.email,
        role: user.role, language: user.language, level: user.level,
        totalScore: 0, quizzesTaken: 0, accuracy: 0,
        badges: [], weakCategories: [], categoryStats: {}
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const token    = generateToken(user._id);
    const userData = user.toObject(); // converts Map → plain object
    userData.categoryStats = Object.fromEntries(user.categoryStats || new Map());

    res.json({
      token,
      user: {
        id:             userData._id,
        username:       userData.username,
        email:          userData.email,
        role:           userData.role,
        language:       userData.language,
        level:          userData.level,
        totalScore:     userData.totalScore,
        quizzesTaken:   userData.quizzesTaken,
        accuracy:       userData.accuracy,
        weakCategories: userData.weakCategories || [],
        badges:         userData.badges         || [],
        categoryStats:  userData.categoryStats  || {}
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user     = await User.findById(req.user._id).select('-password');
    const userData = user.toObject();
    userData.categoryStats = Object.fromEntries(user.categoryStats || new Map());
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { language, level, username } = req.body;
    const user     = await User.findByIdAndUpdate(
      req.user._id,
      { language, level, username },
      { new: true, select: '-password' }
    );
    const userData = user.toObject();
    userData.categoryStats = Object.fromEntries(user.categoryStats || new Map());

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};