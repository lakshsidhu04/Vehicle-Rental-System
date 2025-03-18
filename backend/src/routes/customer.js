const express = require('express');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const db = require('../config/db');
const Customer = require('../models/Customer');


router.get('/profile', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }

    const customerId = req.user.id;
    console.log(customerId);
    try {
        const user = await Customer.getCustomerById(customerId);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);

module.exports = router;