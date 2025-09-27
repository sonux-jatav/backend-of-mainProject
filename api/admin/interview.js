 
const { app, connectDB } = require('../../server');
const adminController = require('../../controllers/adminController');
const { protect, admin } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);
app.use(admin);

app.post('/interview', adminController.addInterview);
app.put('/interview/:id', adminController.editInterview);
app.delete('/interview/:id', adminController.deleteInterview);

module.exports = app;