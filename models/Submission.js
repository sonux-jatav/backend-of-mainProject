// backend/models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problemId: mongoose.Schema.Types.ObjectId,
  problemType: String,
  code: String,
  result: String,
  feedback: String,
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);