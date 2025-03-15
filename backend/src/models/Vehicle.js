const pool = require('../config/db');

const vehicleModel = {
    async getVehicles() {
        const query = 'SELECT * FROM vehicles';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getVehicleById(id) {
        const query = 'SELECT * FROM vehicles WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    },
    async createVehicle(type,brand,model,year,color,rides,rating,license_plate,price_per_day,status) {
        const query = 'INSERT INTO vehicles (type,brand,model,year,color,rides,rating,license_plate,price_per_day,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        await pool.execute(query, [type,brand,model,year,color,rides,rating,license_plate,price_per_day,status]);
    },
    async updateVehicle(id,type,brand,model,year,color,rides,rating,license_plate,price_per_day,status) {
        const query = 'UPDATE vehicles SET type = ?, brand = ?, model = ?, year = ?, color = ?, rides = ?, rating = ?, license_plate = ?, price_per_day = ?, status = ? WHERE id = ?';
        await pool.execute(query, [type,brand,model,year,color,rides,rating,license_plate,price_per_day,status,id]);
    },
    async deleteVehicle(id) {
        const query = 'DELETE FROM vehicles WHERE id = ?';
        await pool.execute(query, [id]);
    }
};

module.exports = vehicleModel;