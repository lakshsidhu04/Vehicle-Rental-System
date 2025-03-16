const express = require('express');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const db = require('../config/db');

router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }

    const customerId = req.user.id;

    try {
        const query = `
            SELECT 
                b.booking_id, b.start_date, b.end_date, b.status, b.created_at,
                v.vehicle_id, v.model, v.license_plate, v.price_per_day,
                c.customer_id, c.name AS customer_name, c.email AS customer_email, c.phone_number,
                m.brand, m.vehicle_type
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.vehicle_id
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN vehicle_models m ON v.model = m.model
            WHERE b.customer_id = ?;
        `;

        const [rows] = await db.execute(query, [customerId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/add-booking', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    
    console.log(req.body);
    
    const customerId = req.user.id;

    const { vehicleId, startDate, endDate } = req.body;

    if (!vehicleId || !startDate || !endDate) {
        return res.status(400).send('Bad Request');
    }

    const query = `
        INSERT INTO bookings ( customer_id,vehicle_id, start_date, end_date, status)
        VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%d'), STR_TO_DATE(?, '%Y-%m-%d'), 'pending');
    `;
    
    try {
        await db.query(query, [ customerId,vehicleId, startDate, endDate]);
        console.log("q1 done");
        const query2 = `UPDATE vehicles SET status = 'booked' WHERE vehicle_id = ?;`;
        await db.query(query2, [vehicleId]);
        res.status(201).send('Booking successful!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
    
});

module.exports = router;
