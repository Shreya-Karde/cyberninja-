// backend/routes/questions.js

const express = require('express');
const router  = express.Router();
const { getQuestions } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

// GET /api/questions?category=all&level=beginner&limit=10
router.get('/', protect, getQuestions);

module.exports = router;