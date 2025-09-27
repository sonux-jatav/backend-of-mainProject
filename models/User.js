// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' },
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  isVerified: { type: Boolean, default: true }, // Default true kar diya
  resetToken: String,
  resetTokenExpiry: Date
});

module.exports = mongoose.model('User', userSchema);