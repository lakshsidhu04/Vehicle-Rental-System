const pool = require('../config/db');

const maintModel = {
    async getAllMaintenances() {
        const query = `SELECT * FROM maintenance as m, vehicles as v, vehicle_models as vm WHERE m.vehicle_id = v.vehicle_id AND v.model = vm.model`;
        const [rows] = await pool.query(query);
        return rows;
    },
    async addMaintenance(vehicle_id, employee_id, description, cost, date) {
        const query = `CALL add_maintenance(?, ?, ?, ?, ?)`;

        const [result] = await pool.query(query, [
            vehicle_id,
            employee_id,  
            description,
            cost,
            date
        ]);

        return result;
    }

};
    
module.exports = maintModel;