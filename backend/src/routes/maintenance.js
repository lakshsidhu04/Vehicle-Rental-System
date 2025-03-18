const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const auth = require('../middlewares/authMiddleware');
router.get('/', auth,async (req, res) => {
    if(req.user.role !== 'admin'){
        return res.status(401).send('Access Denied: Only Admins can view vehicle maintenance');
    }
    try {
        const maintenances = await Maintenance.getAllMaintenances();
        res.json(maintenances);
    } catch (error) {
        res.json({ message: error });
    }
}
);

router.post('/', auth,async (req, res) => {
    if(req.user.role !== 'admin'){
        return res.status(401).send('Access Denied: Only Admins can add vehicle maintenance');
    }
    const { vehicle_id, cost, maintenance_date, description } = req.body.newMaintenance;
    console.log(vehicle_id);
    try {
        const maintenance_id = await Maintenance.addMaintenance(vehicle_id, cost, maintenance_date,description);
        res.json({ maintenance_id });
    } catch (error) {
        res.json({ message: error });
    }
}
);

module.exports = router;