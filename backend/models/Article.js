const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { en: String, hi: String, mr: String },
  content: { en: String, hi: String, mr: String },
  tips: [{ en: String, hi: String, mr: String }],
  icon: { type: String, default: '🛡️' },
  readTime: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);
