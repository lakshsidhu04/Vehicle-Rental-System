const pool = require('../config/db');

const employeeModel = {
    async getAllEmployees() {
        const [rows] = await pool.query('SELECT * FROM employees');
        return rows;
    },
    async getEmployeeById(id) {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
        return rows[0];
    },
    async createEmployee(employee) {
        const [result] = await pool.query('INSERT INTO employees SET ?', [employee]);
        return result.insertId;
    },
    async updateEmployee(id, employee) {
        const [result] = await pool.query('UPDATE employees SET ? WHERE id = ?', [employee, id]);
        return result.affectedRows;
    },
    async deleteEmployee(id) {
        const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
        return result.affectedRows;
    },
};

module.exports = employeeModel;