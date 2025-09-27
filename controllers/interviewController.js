const InterviewQuestion = require('../models/InterviewQuestion');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getInterviewQuestions = async (req, res) => {
  try {
    const { companyTag } = req.query;
    const filter = companyTag ? { companyTag } : {};
    const questions = await InterviewQuestion.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.userId;
    const question = await InterviewQuestion.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Provide feedback on this interview answer. Question: ${question.question}. Answer: ${answer}. Feedback format: Strengths: ..., Weaknesses: ..., Suggestions: ...`;
    const result = await model.generateContent(prompt);
    const feedback = result.response.text();
    const submission = new Submission({ userId, problemId: questionId, problemType: 'interview', feedback });
    await submission.save();
    await User.findByIdAndUpdate(userId, { $push: { progress: submission._id } });
    res.json({ feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};