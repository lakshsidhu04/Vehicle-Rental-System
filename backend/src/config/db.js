const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: dotenv.parsed.DB_PASSWORD,
    database: 'vehiclerentalsystem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
