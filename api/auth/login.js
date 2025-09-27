  
const { app, connectDB } = require('../../server');
const authController = require('../../controllers/authController');

app.use(connectDB);

app.post('/login', authController.login);

module.exports = app;