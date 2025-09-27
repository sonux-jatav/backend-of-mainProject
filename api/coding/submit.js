  
const { app, connectDB } = require('../../server');
const codingController = require('../../controllers/codingController');
const { protect } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);

app.post('/submit', codingController.submitCode);

module.exports = app;