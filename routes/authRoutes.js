const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.get('/verify/:token', authController.verify);
router.post('/login', authController.login);
router.post('/forgot', authController.forgotPassword);
router.post('/reset/:token', authController.resetPassword);

module.exports = router;