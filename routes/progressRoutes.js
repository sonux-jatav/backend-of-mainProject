const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const progressController = require('../controllers/progressController');

router.get('/', protect, progressController.getProgress);

module.exports = router;