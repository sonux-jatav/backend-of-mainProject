  
const { app, connectDB } = require('../../server');
const authController = require('../../controllers/authController');

app.use(connectDB);

app.post('/reset/:token', authController.resetPassword);

module.exports = app;