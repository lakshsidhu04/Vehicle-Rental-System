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
    async createEmployee(employee_name, employee_username, employee_password, employee_email, employee_phone_number, employee_role, employee_salary, employee_hire_date) {
    const query = `CALL add_employee(?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await pool.query(query, [
        employee_username, 
        employee_password, 
        employee_name, 
        employee_email, 
        employee_phone_number, 
        employee_role, 
        employee_salary, 
        employee_hire_date
    ]);
    
    return result;
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
    async getEmployeeMaintenances(id) {
        const query = `
        SELECT 
            m.maintenance_id, 
            m.description, 
            m.cost, 
            m.maintenance_date, 
            vm.brand, 
            vm.model, 
            v.license_plate,
            e.name AS employee_name
        FROM maintenance AS m
        JOIN vehicles AS v ON m.vehicle_id = v.vehicle_id
        JOIN vehicle_models AS vm ON v.model = vm.model
        JOIN employees AS e ON m.employee_id = e.employee_id
        WHERE m.employee_id = ?
    `;

        const [rows] = await pool.query(query, [id]);
        return rows;
    }
};

module.exports = employeeModel;