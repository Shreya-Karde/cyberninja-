const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'phishing', 'password', 'social-engineering', 'network',
      'malware', 'browsing', 'mobile', 'privacy', 'payments', 'cyber-laws'
    ]
  },
  level: { type: String, enum: ['beginner', 'intermediate', 'expert'], required: true },
  type: { type: String, enum: ['mcq', 'image', 'scenario', 'truefalse'], default: 'mcq' },
  question: {
    en: { type: String, required: true },
    hi: { type: String, default: '' },
    mr: { type: String, default: '' }
  },
  options: [{
    en: String,
    hi: String,
    mr: String
  }],
  correctAnswer: { type: Number, required: true },
  explanation: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    mr: { type: String, default: '' }
  },
  image: { type: String, default: '' },
  points: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
