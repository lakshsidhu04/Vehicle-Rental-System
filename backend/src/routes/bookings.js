const express = require('express');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();
const db = require('../config/db');
const bookingModel = require('../models/Bookings');

router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    
    const customerId = req.user.id;

    try {
        const setStatusQuery = `UPDATE bookings SET status = 'completed' WHERE end_date < CURDATE() AND status = 'confirmed';`;
        await db.query(setStatusQuery);
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
            WHERE b.customer_id = ? AND b.status IN ('pending', 'confirmed')
            ORDER BY b.start_date DESC;
        `;

        const [rows] = await db.execute(query, [customerId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/count', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }

    const customerId = req.user.id;
    
    try {
        const query = 'SELECT COUNT(*) AS total_bookings FROM bookings WHERE customer_id = ?;';
        const [rows] = await db.execute(query, [customerId]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);

router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    const user_id = req.user.id;
    const { vehicle_id, start_date, end_date } = req.body;
    try {

        const query = `INSERT INTO bookings (customer_id, vehicle_id, start_date, end_date, status) VALUES (?, ?, ?, ?, 'pending')`;
        await db.query(query, [user_id, vehicle_id, start_date, end_date]);

        res.status(201).json({ message: "Booking request submitted!" });
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ error: "Internal Server Error" });
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

    const checkQuery = `
        SELECT * FROM bookings
        WHERE vehicle_id = ? 
        AND status IN ('pending', 'confirmed') 
        AND (
            (start_date <= STR_TO_DATE(?, '%Y-%m-%d') AND end_date >= STR_TO_DATE(?, '%Y-%m-%d')) 
            OR (start_date <= STR_TO_DATE(?, '%Y-%m-%d') AND end_date >= STR_TO_DATE(?, '%Y-%m-%d'))
            OR (start_date >= STR_TO_DATE(?, '%Y-%m-%d') AND end_date <= STR_TO_DATE(?, '%Y-%m-%d'))
        );
    `;
    
    try {
        const [existingBookings] = await db.query(checkQuery, [vehicleId, startDate, startDate, endDate, endDate, startDate, endDate]);
        
        if (existingBookings.length > 0) {
            return res.status(409).send('Vehicle is already booked for the selected period.');
        }
        
        const insertQuery = `
            INSERT INTO bookings (customer_id, vehicle_id, start_date, end_date, status)
            VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%d'), STR_TO_DATE(?, '%Y-%m-%d'), 'pending');
        `;
        
        await db.query(insertQuery, [customerId, vehicleId, startDate, endDate]);
        console.log("Booking inserted");
        
        const updateQuery = `UPDATE vehicles SET status = 'booked' WHERE vehicle_id = ?;`;
        await db.query(updateQuery, [vehicleId]);
        
        res.status(201).send('Booking successful!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/confirm', auth, async (req, res) => {
    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }
    
    const bookingId = req.body.booking_id;
    const customerId = req.user.id;
    const amount = req.body.amount;
    const paymentMethod = req.body.payment_method;
    
    try {
        const insertId = await bookingModel.confirmBooking(customerId, bookingId, amount, paymentMethod);
        res.status(201).json({ message: 'Payment confirmed!', transaction_id: insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);

router.get('/admin', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Forbidden');
    }
    
    try {
        const query = `
            SELECT 
                b.booking_id, b.start_date, b.end_date, b.status, b.created_at,b.feedback,
                v.vehicle_id, v.model, v.license_plate, v.price_per_day,
                c.customer_id, c.name AS customer_name, c.email AS customer_email, c.phone_number,
                m.brand, m.vehicle_type
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.vehicle_id
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN vehicle_models m ON v.model = m.model;
        `;
        
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);


router.get('/history', auth, async (req, res) => {
    if(req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    const customerId = req.user.id;
    console.log(customerId);
    const query = `
        SELECT b.booking_id, v.vehicle_id, v.model AS vehicle_model, v.license_plate, 
        b.start_date, b.end_date, b.status, b.rating
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.vehicle_id
        WHERE b.customer_id = ? AND b.status IN ('completed', 'rated','cancelled')
        ORDER BY b.start_date DESC;
    `;
    
    try {
        const [rows] = await db.query(query, [customerId]);
        console.log(rows);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


router.post('/rating', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    
    const customerId = req.user.id;
    const { vehicle_id, rating, booking_id} = req.body;
    
    try {
        const query = `UPDATE bookings SET rating = ? , status = 'rated' WHERE booking_id = ? AND customer_id = ?;`;
        const [result] = await db.query(query, [rating, booking_id, customerId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Booking not found');
        }
        
        res.send('Rating updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);

router.post('/feedback', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    
    const { booking_id, feedback } = req.body;
    console.log(booking_id, feedback);
    try {
        const query = `UPDATE bookings SET feedback = ? WHERE booking_id = ?;`;
        await db.query(query, [feedback, booking_id]);
        
        res.send('Feedback submitted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);

router.post('/cancel', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    
    const bookingId = req.body.booking_id;
    const customerId = req.user.id;
    
    try {
        
        const affectedRows = await bookingModel.cancelBooking(bookingId);
        if (affectedRows === 0) {
            return res.status(404).send('Booking not found');
        }
        console.log("Booking cancelled");
        res.send('Booking cancelled successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);

router.post('/pending/cancel', auth, async (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).send('Forbidden');
    }
    
    const bookingId = req.body.booking_id;
    
    try {
        const affectedRows = await bookingModel.cancelBooking(bookingId);
        if (affectedRows === 0) {
            return res.status(404).send('Booking not found');
        }console.log("pending Booking cancelled");
        res.send('Booking cancelled successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
);


module.exports = router;
