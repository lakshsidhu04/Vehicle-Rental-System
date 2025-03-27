const express = require('express');
const db = require('../config/db');

const router = express.Router();    

router.post('/', async (req, res) => {
    console.log(req.body);
    const { name, username, email, password, age, phoneNumber, address, licenseNumber } = req.body;

    if (!name || !email || !password || !licenseNumber) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const query = `
        INSERT INTO customers (name, username, email, password, age, phone_number, address, license_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        await db.query(query, [name, username, email, password, age, phoneNumber, address, licenseNumber]);
        res.status(201).json({ message: 'Signup successful!' });
    } catch (err) {
        console.error(err);
        if (err.sqlState === '45000') {
            return res.status(400).json({ message: err.sqlMessage });
        }

        res.status(500).json({ message: 'Signup failed due to a server error.' });
    }
});


module.exports = router;