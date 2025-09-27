// backend/models/Mcq.js
const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }, // Changed to String
  explanation: String,
  companyTag: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
});

module.exports = mongoose.model('Mcq', mcqSchema);