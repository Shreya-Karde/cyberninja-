// routes/quiz.js
const express = require('express');
const router = express.Router();
const { submitQuiz, getHistory } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getHistory);
module.exports = router;
