// backend/routes/codingRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const codingController = require('../controllers/codingController');

router.get('/', protect, codingController.getCodingProblems); // Changed to '/'
router.post('/submit', protect, codingController.submitCode);

module.exports = router;