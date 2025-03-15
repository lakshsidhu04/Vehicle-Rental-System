const auth = require('../controllers/authController');
const express = require('express');
const dotenv = require('dotenv').config();
const db = require('../config/db');
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if(username === 'admin' && password === dotenv.parsed.ADMIN_PASSWORD){
        res.json({ token: auth({
            id: 1,
            email: 'admin',
            role: 'admin'
        }) });
    }
    else{
        // query the password from database, compare the password with the password in database
        // If password is correct, generate token, else, return 401 Unauthorized
        query = "SELECT * FROM users WHERE username = ? AND password = ?";
        db.query(query, [username, password], (err, result) => {
            if(err) throw err;
            if(result.length > 0){
                res.json({ token: auth({
                    id: result[0].id,
                    email: result[0].email,
                    role: 'user'
                }) });
            }
            else{
                res.status(401).json({ message: 'Unauthorized' });
            }
        });
    }
})
