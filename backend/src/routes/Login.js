const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const db = require('../config/db');
const router = express.Router();

// Function to generate JWT
const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
};

router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        if(role === 'admin'){
            if(username !== 'admin' || password !== process.env.ADMIN_PASSWORD){
                return res.status(401).json({ message: "Invalid credentials." });
            }
        }
        
        if(role === 'employee'){
            const query = `SELECT * FROM employees WHERE username = ?`;
            const [rows] = await db.execute(query, [username]);
            
            if (rows.length === 0) {
                return res.status(401).json({ message: "Invalid credentials." });
            }
    
            const user = rows[0];
            
            if (password !== user.password) {
                return res.status(401).json({ message: "Invalid credentials." });
            }
            
            const token = generateToken({
                id: user.employee_id,
                email: user.email,
                role: 'employee'
            });
    
            res.json({ token });
        }

        const query = `SELECT * FROM customers WHERE username = ?`;
        const [rows] = await db.execute(query, [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = rows[0];
        
        if (password !== user.password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        const token = generateToken({
            id: user.customer_id,
            email: user.email,
            role: 'customer'
        });

        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
