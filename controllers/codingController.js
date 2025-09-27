// backend/controllers/codingController.js
const CodingProblem = require('../models/CodingProblem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const axios = require('axios');

exports.getCodingProblems = async (req, res) => {
  try {
    const { companyTag } = req.query;
    const filter = companyTag ? { companyTag } : {};
    const problems = await CodingProblem.find(filter);
    res.json(problems.length ? problems : []); // Return empty array if no data
  } catch (err) {
    console.error('Get coding problems error:', err.stack);
    res.status(500).json({ error: err.message });
  }
};

exports.submitCode = async (req, res) => {
  try {
    const { problemId, code, languageId } = req.body;
    if (!req.userId) throw new Error('User not authenticated');
    const userId = req.userId;
    const problem = await CodingProblem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    let result = 'Passed';
    let details = [];
    for (let test of problem.testCases) {
      const subRes = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: code,
          language_id: languageId,
          stdin: test.input,
          expected_output: test.output,
        },
        {
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );
      const token = subRes.data.token;
      let statusRes;
      do {
        await new Promise((r) => setTimeout(r, 1000));
        statusRes = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`,
          {
            headers: {
              'x-rapidapi-key': process.env.RAPIDAPI_KEY,
              'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );
      } while (statusRes.data.status.id <= 2);

      const stdout = statusRes.data.stdout ? atob(statusRes.data.stdout) : '';
      const stderr = statusRes.data.stderr ? atob(statusRes.data.stderr) : '';
      const testResult = statusRes.data.status.id === 3 ? 'Passed' : 'Failed';
      if (testResult === 'Failed') result = 'Failed';
      details.push({
        testInput: test.input,
        output: stdout,
        stderr: stderr,
        status: statusRes.data.status.description,
      });
    }

    const submission = new Submission({ userId, problemId, problemType: 'coding', code, result });
    await submission.save();
    await User.findByIdAndUpdate(userId, { $push: { progress: submission._id } });
    res.json({ result, details });
  } catch (err) {
    console.error('Submit code error:', err.stack);
    res.status(500).json({ error: err.message });
  }
};