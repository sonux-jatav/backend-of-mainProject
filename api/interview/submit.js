  
const { app, connectDB } = require('../../server');
const interviewController = require('../../controllers/interviewController');
const { protect } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);

app.post('/submit', interviewController.submitAnswer);

module.exports = app;