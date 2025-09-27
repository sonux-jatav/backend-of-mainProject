// backend/routes/mcqRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const mcqController = require('../controllers/mcqController');

router.get('/', protect, mcqController.getMcqs);
router.post('/submit', protect, mcqController.submitMcq);

module.exports = router;