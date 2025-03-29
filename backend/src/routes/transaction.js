const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const db = require('../config/db');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const transactionModel = require('../models/Transaction');

router.get('/', auth,async (req, res) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({ message: "Access denied." });
    }
    try {
        const transactions = await transactionModel.getAllTransactions();
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
}
);

module.exports = router;    
