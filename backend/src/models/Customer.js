const pool = require('../config/db');

const customerModel = {
    async getCustomers() {
        const query = 'SELECT * FROM customers';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getCustomerById(id) {
        const query = 'SELECT * FROM customers WHERE customer_id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    },
    async createCustomer(id,first_name,last_name,email,password,phone_number) {
        const query = 'INSERT INTO customers (id,first_name,last_name,email,password,phone_number) VALUES (?,?,?,?,?,?)';
        const [rows] = await pool.execute(query, [id,first_name,last_name,email,password,phone_number]);
        return rows;
    },
    async updateCustomer(id,first_name,last_name,email,password,phone_number) {
        const query = 'UPDATE customers SET first_name = ?, last_name = ?, email = ?, password = ?, phone_number = ? WHERE id = ?';
        const [rows] = await pool.execute(query, [first_name,last_name,email,password,phone_number,id]);
        return rows;
    },
    async deleteCustomer(id) {
        const query = 'DELETE FROM customers WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows;
    }
};

module.exports = customerModel;
