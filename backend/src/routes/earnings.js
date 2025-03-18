const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const earningsModel = require('../models/Earnings');

router.get('/',auth, async (req, res) => {
    if(req.user.role!=='admin') {
        return res.status(403).send('Forbidden');
    }
    try {
        const earnings = await earningsModel.getEarnings();
        console.log(earnings);
        res.json(earnings);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

module.exports = router;