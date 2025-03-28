const express = require('express');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const db = require('../config/db');
const Fines = require('../models/Fines');

router.get('/',auth, async (req, res) => {
    if(req.user.role !== 'customer'){
        return res.status(403).send('Forbidden');
    }
    try{
        const fines = await Fines.getFineByCustomerId(req.user.id);
        res.json(fines);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/payFine', auth, async (req, res) => {
    if(req.user.role !== 'customer'){
        return res.status(403).send('Forbidden');
    }
    try{
        const customer_id = req.user.id;
        const { booking_id, payment_method, amount } = req.body;
        const fine = await Fines.payFine(customer_id, booking_id, amount, payment_method);
        res.json(fine);
    }
    catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;   
