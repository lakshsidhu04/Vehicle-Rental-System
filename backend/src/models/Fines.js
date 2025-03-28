const pool = require('../config/db');

const finesModel = {
    async getAllFines() {
        const [rows] = await pool.query('SELECT * FROM fine');
        return rows;
    },
    
    async getFineById(id) {
        // select fines where id = booking.customer_id
        const [rows] = await pool.query('SELECT * FROM fine WHERE customer_id = ?', [id]);
        return rows;
    },
    async getFineByCustomerId(customerId) {
    const query = `
    SELECT 
        f.maintenance_id, 
        f.booking_id, 
        m.description, 
        m.cost, 
        m.maintenance_date,
        v.vehicle_id,
        v.license_plate, 
        vm.brand, 
        vm.model,
        v.year,
        v.color
    FROM fine AS f
    JOIN bookings AS b ON f.booking_id = b.booking_id
    JOIN maintenance AS m ON f.maintenance_id = m.maintenance_id
    JOIN vehicles AS v ON b.vehicle_id = v.vehicle_id
    JOIN vehicle_models AS vm ON v.model = vm.model
    WHERE b.customer_id = ?
`;
    
    const [rows] = await pool.query(query, [customerId]);
    return rows;
}
    ,
    async addFine(customer_id, booking_id, fine_reason, maintenance_id) {
        const query=`INSERT INTO fine(maintenance_id,booking_id) VALUES (?,?)`
        const [result] = await pool.query(query, [maintenance_id, booking_id]);
        return result.insertId;
    },
    async payFine(customer_id, booking_id, amount, paymentMethod) {
        const query=`DELETE FROM fine WHERE booking_id = ?`
        const [result] = await pool.query(query, [booking_id]);
        
        // add a fine transaction
        const [result2] = await pool.query('INSERT INTO transactions (customer_id,booking_id, amount, payment_method, transaction_type) VALUES (?, ?, ?, ?,?)', [customer_id, booking_id, amount, paymentMethod, 'fine']);
        return result2.insertId;
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

module.exports = finesModel;