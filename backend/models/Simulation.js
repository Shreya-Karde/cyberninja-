const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  type: { type: String, enum: ['phishing', 'password-breach', 'scam-call', 'social-engineering'], required: true },
  title: { en: String, hi: String, mr: String },
  description: { en: String, hi: String, mr: String },
  steps: [{
    stepNumber: Number,
    content: { en: String, hi: String, mr: String },
    action: String,
    result: { en: String, hi: String, mr: String },
    isCorrect: Boolean,
    hint: { en: String, hi: String, mr: String }
  }],
  lesson: { en: String, hi: String, mr: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Simulation', simulationSchema);
