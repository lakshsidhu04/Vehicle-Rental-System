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
    async createVehicle(id,type,brand,model,year,color,rides,rating,license_plate,price_per_day,status) {
        const query = 'INSERT INTO vehicles (id,type,brand,model,year,color,rides,rating,license_plate,price_per_day,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        const [rows] = await pool.execute(query, [id,type,brand,model,year,color,rides,rating,license_plate,price_per_day,status]);
        return rows;
    },
    async updateVehicle(id,type,brand,model,year,color,rides,rating,license_plate,price_per_day,status) {
        const query = 'UPDATE vehicles SET type = ?, brand = ?, model = ?, year = ?, color = ?, rides = ?, rating = ?, license_plate = ?, price_per_day = ?, status = ? WHERE id = ?';
        const [rows] = await pool.execute(query, [type,brand,model,year,color,rides,rating,license_plate,price_per_day,status,id]);
        return rows;
    },
    async deleteVehicle(id) {
        const query = 'DELETE FROM vehicles WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows;
    }
};

module.exports = vehicleModel;