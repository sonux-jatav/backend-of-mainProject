  
const { app, connectDB } = require('../../server');
const authController = require('../../controllers/authController');

app.use(connectDB);

app.post('/signup', authController.signup);

module.exports = app;