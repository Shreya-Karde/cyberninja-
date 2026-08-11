const Question   = require('../models/Question');
const Article    = require('../models/Article');
const Simulation = require('../models/Simulation');
const User       = require('../models/User');
const QuizResult = require('../models/QuizResult');

exports.getStats = async (req, res) => {
  try {
    const [users, questions, articles, simulations, quizResults] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Question.countDocuments(),
      Article.countDocuments(),
      Simulation.countDocuments(),
      QuizResult.countDocuments()
    ]);
    res.json({ users, questions, articles, simulations, quizResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Questions CRUD ─────────────────────────────────────────────────────────────

exports.createQuestion = async (req, res) => {
  try {
    const { category, level, type, question, options, correctAnswer, explanation, image, points } = req.body;

    if (!question?.en?.trim()) {
      return res.status(400).json({ message: 'English question text is required' });
    }
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'At least 2 options are required' });
    }
    if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer >= options.length) {
      return res.status(400).json({ message: 'correctAnswer must be a valid option index' });
    }

    const q = await Question.create({
      category,
      level,
      type: type || 'mcq',
      question,
      options,
      correctAnswer,
      explanation,
      image: image || '',
      points: points || (level === 'expert' ? 30 : level === 'intermediate' ? 20 : 10),
      isActive: true,
    });
    res.status(201).json(q);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const {
      category, level, type, question, options,
      correctAnswer, explanation, image, points, isActive
    } = req.body;

    const update = {
      ...(category      !== undefined && { category }),
      ...(level         !== undefined && { level }),
      ...(type          !== undefined && { type }),
      ...(question      !== undefined && { question }),
      ...(options       !== undefined && { options }),
      ...(correctAnswer !== undefined && { correctAnswer }),
      ...(explanation   !== undefined && { explanation }),
      ...(image         !== undefined && { image }),
      ...(points        !== undefined && { points }),
      ...(isActive      !== undefined && { isActive }),
    };

    const q = await Question.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json(q);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Articles CRUD ──────────────────────────────────────────────────────────────

exports.createArticle = async (req, res) => {
  try {
    const a = await Article.create(req.body);
    res.status(201).json(a);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Users ──────────────────────────────────────────────────────────────────────

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};