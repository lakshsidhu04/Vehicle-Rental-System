const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicle');
const loginRoutes = require('./routes/login');
const bookingRoutes = require('./routes/bookings');
const employeeRoutes = require('./routes/employee');
const customerRoutes = require('./routes/customer');
const maintRoutes = require('./routes/maintenance');
const EarningRoutes = require('./routes/earnings');
require('dotenv').config();
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/vehicles', vehicleRoutes);
app.use('/login', loginRoutes);
app.use('/bookings', bookingRoutes);
app.use('/employees', employeeRoutes);
app.use('/customers', customerRoutes);
app.use('/maintenance', maintRoutes);
app.use('/earnings', EarningRoutes);
const PORT = 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
