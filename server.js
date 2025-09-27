// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
}));
app.use(express.json());

// -------------------------
// MongoDB Connection Middleware
// -------------------------
let cached = global.mongo;

if (!cached) cached = global.mongo = { conn: null, promise: null };

async function connectDB(req, res, next) {
  if (cached.conn) {
    // console.log('Using existing MongoDB connection');
    return next();
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    // console.log('MongoDB connected');
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    res.status(500).json({ success: false, error: 'MongoDB connection failed' });
  }
}

// Use the middleware for all routes
app.use(connectDB);

// -------------------------
// Routes
// -------------------------
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/mcq', require('./routes/mcqRoutes'));
  app.use('/api/coding', require('./routes/codingRoutes'));
  app.use('/api/interview', require('./routes/interviewRoutes'));
  app.use('/api/progress', require('./routes/progressRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
} catch (err) {
  console.error('Route loading failed:', err.message);
}

// -------------------------
// Serverless Export
// -------------------------
module.exports = app;
