const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const db = require('../config/db');
const router = express.Router();
const generateToken = require('../controllers/authController');

router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    console.log(req.body.username);
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    
    try {
        if(role === 'admin'){
            const query=`SELECT * FROM employees where username = ?`;
            const [rows] = await db.execute(query, [username]);
            var flag = 1;
            if(rows.length === 0){
                flag = 0;
            }
            
            var user = {};

            if(flag>0){
                user = rows[0];
                if (password !== user.password) {
                    flag = 0;
                }
            }

            
            
            if(flag === 0){
                if(username==='admin' && password===process.env.ADMIN_PASSWORD){
                    const token = generateToken({
                        id: 0,
                        email: 'admin',
                        role: 'admin'
                    });
                    res.json({ token });
                }
                else{
                    return res.status(401).json({ message: "Invalid credentials." });
                }
            }
            else{
                const token = generateToken({
                    id: user.employee_id,
                    email: user.email,
                    role: 'admin'
                });
                res.json({ token });
            }

        }
        else if(role === 'employee'){
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

        else{
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
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
