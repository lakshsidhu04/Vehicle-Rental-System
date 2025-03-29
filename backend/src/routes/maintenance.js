const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Fines = require('../models/Fines');
const auth = require('../middlewares/authMiddleware');
const pool = require('../config/db');
router.get('/', auth,async (req, res) => {
    if(req.user.role !== 'admin'){
        return res.status(401).send('Access Denied: Only Admins can view vehicle maintenance');
    }
    try {
        console.log('getting all maintenances');
        const maintenances = await Maintenance.getAllMaintenances();
        res.json(maintenances);
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
}
);

router.post('/', auth,async (req, res) => {
    if(req.user.role !== 'admin'){
        return res.status(401).send('Access Denied: Only Admins can add vehicle maintenance');
    }
    const { vehicle_id, cost, maintenance_date,employee_id, description, is_customer_fault } = req.body.newMaintenance;
    console.log(vehicle_id, cost, maintenance_date,employee_id, description);
    try {
        const maintenance_id = await Maintenance.addMaintenance(vehicle_id, employee_id, description,cost,maintenance_date);
        if(is_customer_fault){
            // check if booking id is correct and customer id is correc for that booking
            const { customer_id, booking_id, fine_reason } = req.body.newMaintenance;
            console.log(customer_id, booking_id, fine_reason);
            const query = `SELECT * FROM bookings WHERE booking_id = ?`;
            const [rows] = await pool.query(query, [booking_id]);
            console.log(rows[0].customer_id);
            console.log('status', rows[0].status);
            if(rows.length === 0){
                throw 'Booking does not exist';
            }
            if(Number(rows[0].customer_id) !== Number(customer_id)){
                console.log(rows[0].customer_id, customer_id);
                throw 'Customer id does not match booking id';
            }
            if(!(rows[0].status === 'completed' || rows[0].status === 'rated')){
                throw 'Booking is not completed';
            }
            console.log("maintenance_id", maintenance_id);
            const insertId = await Fines.addFine(Number(customer_id), Number(booking_id), fine_reason,Number(maintenance_id));
        }
        res.json({ maintenance_id });
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
}
);

router.post('/remove', auth, async (req, res) => {
    if(!(req.user.role === 'admin' || req.user.role === 'employee')){
        return res.status(401).send('Access Denied: Only Admins can remove vehicle maintenance');
    }
    const { maintenance_id,vehicle_id } = req.body;
    console.log(maintenance_id);
    try {
        const result = await Maintenance.deleteMaintenance(maintenance_id);
        // update vehicle status to available
        const query = `UPDATE vehicles SET status = 'avail' WHERE vehicle_id = ?`;
        await pool.query(query, [vehicle_id]);

        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ message: error });
    }
});

module.exports = router;