const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  question: String,
  type: String,
  companyTag: String
});

module.exports = mongoose.model('InterviewQuestion', interviewSchema);