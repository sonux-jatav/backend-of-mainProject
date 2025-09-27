// backend/controllers/mcqController.js
const Mcq = require('../models/Mcq');

exports.getMcqs = async (req, res) => {
  try {
    const { companyTag } = req.query;
    const filter = companyTag ? { companyTag } : {};
    const mcqs = await Mcq.find(filter);
    res.json(mcqs.length ? mcqs : []);
  } catch (err) {
    console.error('Get MCQs error:', err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.submitMcq = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!req.userId) throw new Error('User not authenticated');

    const mcqIds = answers.map((a) => a.id);
    const mcqs = await Mcq.find({ _id: { $in: mcqIds } });

    let score = 0;
    const total = mcqs.length;
    const explanations = mcqs.map((mcq) => {
      const userAnswer = answers.find((a) => a.id === mcq._id.toString())?.selected;
      const isCorrect = mcq.correctAnswer === userAnswer;
      if (isCorrect) score++;
      return {
        question: mcq.question,
        correct: mcq.correctAnswer,
        yourAnswer: userAnswer || 'Not answered',
        explanation: mcq.explanation,
        correct: isCorrect,
      };
    });

    res.json({ score, total, explanations });
  } catch (err) {
    console.error('Submit MCQ error:', err.stack);
    res.status(500).json({ error: err.message });
  }
};