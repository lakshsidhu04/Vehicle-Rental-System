const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicle');

require('dotenv').config();
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/vehicles', vehicleRoutes);

const PORT = 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
