const express = require('express');
const router = express.Router();
const {
  getStats, createQuestion, updateQuestion, deleteQuestion, getAllQuestions,
  createArticle, getAllArticles, deleteArticle, getAllUsers
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

router.get('/articles', getAllArticles);
router.post('/articles', createArticle);
router.delete('/articles/:id', deleteArticle);

module.exports = router;
