const pool = require('../config/db');

const transactionModel = {
    async getAllTransactions() {
        const [rows] = await pool.query('SELECT * FROM transactions');
        return rows;
    },

    async getTransactionById(id) {
        const [rows] = await pool.query('SELECT * FROM transactions WHERE transaction_id = ?', [id]);
        return rows;
    },

    async getTransactionByBookingId(bookingId) {
        const [rows] = await pool.query('SELECT * FROM transactions WHERE booking_id = ?', [bookingId]);
        return rows;
    },

    async addTransaction(customer_id, booking_id, amount, paymentMethod, transaction_type) {
        const query=`INSERT INTO transactions(customer_id, booking_id, amount, payment_method, transaction_type) VALUES (?, ?, ?, ?, ?)`
        const [result] = await pool.query(query, [customer_id, booking_id, amount, paymentMethod, transaction_type]);
        return result.insertId;
    },
};

module.exports = transactionModel;