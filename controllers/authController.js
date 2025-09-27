// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

// Nodemailer transporter (ab use nahi hoga, lekin rakh rahe hain agar future mein chahiye)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Signup request received:', { name, email, password });
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, email, password) are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();
    console.log('User saved successfully:', user._id);
    res.status(201).json({ message: 'User created successfully. You can login now.' });
  } catch (err) {
    console.error('Signup error details:', err.message, err.stack);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Verify function ab zaruri nahi, isliye comment kar rahe hain (future use ke liye rakhen)
exports.verify = async (req, res) => {
  // try {
  //   const { token } = req.params;
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.userId);
  //   if (!user) return res.status(400).json({ error: 'Invalid token' });
  //   user.isVerified = true;
  //   await user.save();
  //   res.json({ message: 'Email verified' });
  // } catch (err) {
  //   res.status(400).json({ error: 'Invalid or expired token' });
  // };
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // isVerified check hata diya
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Login successful for:', email);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Reset password: http://localhost:5173/reset/${token}`
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reset email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};