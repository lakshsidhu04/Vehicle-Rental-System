const pool = require('../config/db');

const maintModel = {
    async getAllMaintenances() {
        const query = `
    SELECT 
        m.maintenance_id, 
        m.description, 
        m.cost, 
        m.maintenance_date, 
        vm.brand, 
        vm.model, 
        v.license_plate, 
        v.vehicle_id,
        e.name AS employee_name
    FROM maintenance AS m
    JOIN vehicles AS v ON m.vehicle_id = v.vehicle_id
    JOIN vehicle_models AS vm ON v.model = vm.model
    JOIN employees AS e ON m.employee_id = e.employee_id
`;
        
        const [rows] = await pool.query(query);
        console.log(rows);
        return rows;
    },
    async addMaintenance(vehicle_id, employee_id, description, cost, date) {
        const query = `CALL add_maintenance(?, ?, ?, ?, ?)`; // Stored procedure call
        const [result] = await pool.query(query, [
            vehicle_id,
            employee_id,
            description,
            cost,
            date
        ]);
        
        const [[{ maintenance_id }]] = await pool.query(`SELECT LAST_INSERT_ID() as maintenance_id`);

        const q2 = `UPDATE vehicles SET status = 'maintenance' WHERE vehicle_id = ?`;
        await pool.query(q2, [vehicle_id]);

        return maintenance_id;
    },
    async deleteMaintenance(maintenance_id) {
        const query = `DELETE FROM maintenance WHERE maintenance_id = ?`;
        const [result] = await pool.query(query, [maintenance_id]);
        const q2 = `UPDATE vehicles SET status = 'available' WHERE vehicle_id = ?`;
        return result.affectedRows;
    },

};
    
module.exports = maintModel;