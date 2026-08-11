const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  language: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
  level: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'beginner' },
  totalScore: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  weakCategories: [{ type: String }],
  categoryStats: {
    type: Map,
    of: {
      correct: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    default: {}
  },
  badges: [{ name: String, earnedAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
