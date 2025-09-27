  
const { app, connectDB } = require('../../server');
const adminController = require('../../controllers/adminController');
const { protect, admin } = require('../../middleware/authMiddleware');

app.use(connectDB);
app.use(protect);
app.use(admin);

app.post('/coding', adminController.addCoding);
app.put('/coding/:id', adminController.editCoding);
app.delete('/coding/:id', adminController.deleteCoding);

module.exports = app;