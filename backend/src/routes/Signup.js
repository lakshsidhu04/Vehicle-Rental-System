const express = require('express');
const db = require('../config/db');

const router = express.Router();    

router.post('/signup', async (req, res) => {
    const { name, email, password, age, phoneNumber, address, licenseNumber } = req.body;

    if (!name || !email || !password || !licenseNumber) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const query = 'INSERT INTO customers (name, email, password, age, phone_number, address, license_number) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, password, age, phoneNumber, address, licenseNumber], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Email or license number already exists.' });
            }
            return res.status(500).json({ message: 'Database error.' });
        }
        res.json({ message: 'Signup successful!' });
    });
});