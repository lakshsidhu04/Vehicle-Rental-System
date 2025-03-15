const pool = require('../config/db');

const bookingsModel = {
    async getAllBookings() {
        const [rows] = await pool.query('SELECT * FROM bookings');
        return rows;
    },
    
    async getBookingById(id) {
        const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
        return rows;
    },
    
    async createBooking(booking) {
        const [result] = await pool.query('INSERT INTO bookings SET ?', booking);
        return result.insertId;
    },
    
    async updateBooking(id, booking) {
        const [result] = await pool.query('UPDATE bookings SET ? WHERE id = ?', [booking, id]);
        return result.affectedRows;
    },
    
    async deleteBooking(id) {
        const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
        return result.affectedRows;
    },
};

module.exports = bookingsModel;