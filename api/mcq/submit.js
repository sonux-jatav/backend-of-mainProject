  
const { app, connectDB } = require('../../server');
const mcqController = require('../../controllers/mcqController');
const { protect } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);

app.post('/submit', mcqController.submitMcq);

module.exports = app;