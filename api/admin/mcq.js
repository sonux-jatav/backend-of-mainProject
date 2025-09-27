  
const { app, connectDB } = require('../../server');
const adminController = require('../../controllers/adminController');
const { protect, admin } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);
app.use(admin);

app.post('/mcq', adminController.addMcq);
app.put('/mcq/:id', adminController.editMcq);
app.delete('/mcq/:id', adminController.deleteMcq);

module.exports = app;