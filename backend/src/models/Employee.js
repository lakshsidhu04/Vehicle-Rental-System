const pool = require('../config/db');

const employeeModel = {
    async getAllEmployees() {
        const [rows] = await pool.query('SELECT * FROM employees');
        return rows;
    },
    async getEmployeeById(id) {
        const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [id]);
        return rows[0];
    },
    async createEmployee(employee_name, employee_username, employee_password,employee_email, employee_phone_number, employee_role, employee_salary,employee_hire_date) {
        const query = `
            INSERT INTO employees (name, username, password, email, phone_number, role, salary, hire_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(query, [
            employee_name, 
            employee_username, 
            employee_password, 
            employee_email, 
            employee_phone_number, 
            employee_role, 
            employee_salary, 
            employee_hire_date
        ]);
        return result.insertId;
    },
    async updateEmployee(id, employee) {
        const query = `
        UPDATE employees 
        SET email = ?, phone_number = ?, role = ?, salary = ?
        WHERE employee_id = ?
    `;

        const [result] = await pool.query(query, [
            employee.email,
            employee.phone_number,
            employee.role,
            employee.salary,
            id
        ]);

        return result.affectedRows;
    }
,
    async deleteEmployee(id) {
        const [result] = await pool.query('DELETE FROM employees WHERE employee_id = ?', [id]);
        return result.affectedRows;
    },
};

module.exports = employeeModel;