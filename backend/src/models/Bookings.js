const pool = require('../config/db');

const bookingsModel = {
    async getAllBookings() {
        const [rows] = await pool.query('SELECT * FROM bookings');
        return rows;
    },
    
    async getBookingById(id) {
        const [rows] = await pool.query('SELECT * FROM bookings WHERE booking_id = ?', [id]);
        return rows;
    },
    async getBookingByCustomerId(customerId) {
        const [rows] = await pool.query('SELECT * FROM bookings WHERE customer_id = ?', [customerId]);
        return rows;
    },
    async createBooking(booking) {
        const [result] = await pool.query('INSERT INTO bookings SET ?', booking);
        return result.insertId;
    },
    async confirmBooking(customer_id,booking_id, amount, paymentMethod) {
        const [result] = await pool.query('INSERT INTO transactions (customer_id,booking_id, amount, payment_method, transaction_type) VALUES (?, ?, ?, ?,?)', [customer_id, booking_id, amount, paymentMethod, 'booking_payment']);
        // set booking status to confirmed
        await pool.query('UPDATE bookings SET status = ? WHERE booking_id = ?', ['confirmed', booking_id]);
        return result.insertId;
    },
    
    async updateBooking(id, booking) {
        const [result] = await pool.query('UPDATE bookings SET ? WHERE booking_id = ?', [booking, id]);
        return result.affectedRows;
    },
    async cancelBooking(id){
        const [result] = await pool.query('UPDATE bookings SET status = ? WHERE booking_id = ?', ['cancelled', id]);
        return result.affectedRows;
    },
    
    async deleteBooking(id) {
        const [result] = await pool.query('DELETE FROM bookings WHERE booking_id = ?', [id]);
        return result.affectedRows;
    },
};

module.exports = bookingsModel;