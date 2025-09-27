const Submission = require('../models/Submission');

exports.getProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const submissions = await Submission.find({ userId }).sort({ timestamp: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};