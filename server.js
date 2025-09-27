const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Dynamic frontend URL
}));
app.use(express.json());

// MongoDB Connection Middleware
let cached = global.mongo;

if (!cached) cached = global.mongo = { conn: null, promise: null };

async function connectDB(req, res, next) {
  if (cached.conn) {
    return next();
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    res.status(500).json({ success: false, error: 'MongoDB connection failed' });
  }
}

module.exports = { app, connectDB };