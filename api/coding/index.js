const { app, connectDB } = require('../../server');
const codingController = require('../../controllers/codingController');
const { protect } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);

app.get('/', codingController.getCodingProblems);

module.exports = app;