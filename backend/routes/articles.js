const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const articles = await Article.find({ isActive: true });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
