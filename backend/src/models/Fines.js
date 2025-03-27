const pool = require('../config/db');

const finesModel = {
    async getAllFines() {
        const [rows] = await pool.query('SELECT * FROM fine');
        return rows;
    },
    
    async getFineById(id) {
        // select fines where id = booking.customer_id
        const query =`SELECT * `
        const [rows] = await pool.query('SELECT * FROM fine WHERE customer_id = ?', [id]);
        return rows;
    },
    async getFineByCustomerId(customerId) {
        const [rows] = await pool.query('SELECT * FROM fines WHERE customer_id = ?', [customerId]);
        return rows;
    },
    async createFine(fine) {
        const [result] = await pool.query('INSERT INTO fines SET ?', fine);
        return result.insertId;
    },
    async updateFine(id, fine) {
        const [result] = await pool.query('UPDATE fines SET ? WHERE fine_id = ?', [fine, id]);
        return result.affectedRows;
    },
    
    async deleteFine(id) {
        const [result] = await pool.query('DELETE FROM fines WHERE fine_id = ?', [id]);
        return result.affectedRows;
    },
};