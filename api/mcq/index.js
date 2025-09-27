  
const { app, connectDB } = require('../../server');
const mcqController = require('../../controllers/mcqController');
const { protect } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);

app.get('/', mcqController.getMcqs);

module.exports = app;