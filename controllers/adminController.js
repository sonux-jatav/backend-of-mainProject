const Mcq = require('../models/Mcq');
const CodingProblem = require('../models/CodingProblem');
const InterviewQuestion = require('../models/InterviewQuestion');

exports.addMcq = async (req, res) => {
  try {
    const mcq = new Mcq(req.body);
    await mcq.save();
    res.status(201).json(mcq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editMcq = async (req, res) => {
  try {
    const { id } = req.params;
    const mcq = await Mcq.findByIdAndUpdate(id, req.body, { new: true });
    res.json(mcq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMcq = async (req, res) => {
  try {
    const { id } = req.params;
    await Mcq.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Similar functions for coding and interview: addCoding, editCoding, deleteCoding, addInterview, etc.
exports.addCoding = async (req, res) => {
  try {
    const problem = new CodingProblem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editCoding = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await CodingProblem.findByIdAndUpdate(id, req.body, { new: true });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCoding = async (req, res) => {
  try {
    const { id } = req.params;
    await CodingProblem.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addInterview = async (req, res) => {
  try {
    const question = new InterviewQuestion(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await InterviewQuestion.findByIdAndUpdate(id, req.body, { new: true });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    await InterviewQuestion.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};