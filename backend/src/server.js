const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicle');
const loginRoutes = require('./routes/login');
const bookingRoutes = require('./routes/bookings');

require('dotenv').config();
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/vehicles', vehicleRoutes);
app.use('/login', loginRoutes);
app.use('/bookings', bookingRoutes);
const PORT = 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
