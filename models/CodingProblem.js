// backend/models/CodingProblem.js
const mongoose = require('mongoose');

const codingSchema = new mongoose.Schema({
  title: String,
  description: String,
  examples: [{ input: String, output: String }],
  testCases: [{ input: String, output: String }],
  companyTag: String,
});

module.exports = mongoose.model('CodingProblem', codingSchema);