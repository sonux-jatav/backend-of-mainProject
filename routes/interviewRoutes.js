const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const interviewController = require('../controllers/interviewController');

router.get('/', protect, interviewController.getInterviewQuestions);
router.post('/submit', protect, interviewController.submitAnswer);

module.exports = router;