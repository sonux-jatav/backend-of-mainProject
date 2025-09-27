  
const { app, connectDB } = require('../../server');
const progressController = require('../../controllers/progressController');
const { protect } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);

app.get('/', progressController.getProgress);

module.exports = app;