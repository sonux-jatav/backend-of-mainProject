  
const { app, connectDB } = require('../../server');
const authController = require('../../controllers/authController');

app.use(connectDB);

app.post('/forgot', authController.forgotPassword);

module.exports = app;