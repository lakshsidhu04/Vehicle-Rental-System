const pool = require('../config/db');

const vehicleModel = {
    async getVehicles() {
        const query = 'SELECT * FROM vehicles';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getVehicleModels() {
        const query = 'SELECT DISTINCT model FROM vehicles';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getAllVehiclesForAdmin(){
        const query = 'SELECT v.vehicle_id, v.model, v.year, v.color,v.rides,v.rating,v.license_plate,v.price_per_day,v.status,  m.brand,m.vehicle_type FROM vehicles AS v, vehicle_models AS m WHERE v.model = m.model';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async addModel(brand, model, vehicle_type){
        const query = 'INSERT INTO vehicle_models (brand, model, vehicle_type) VALUES (?,?,?)';
        await pool.execute(query, [brand, model, vehicle_type]);
    },
    async getModels(){
        const query = 'SELECT * FROM vehicle_models';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getMaintainenceVehicles(){
        const query = 'SELECT v.vehicle_id, v.model, v.year, v.color,v.rides,v.rating,v.license_plate,v.price_per_day, m.brand,m.vehicle_type FROM vehicles AS v, vehicle_models AS m WHERE v.model = m.model AND v.status = "maintenance"';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getVehiclesWithModelBrand(){
        const query = 'SELECT v.vehicle_id, v.model, v.year, v.color,v.rides,v.rating,v.license_plate,v.price_per_day, m.brand,m.vehicle_type FROM vehicles AS v, vehicle_models AS m WHERE v.model = m.model AND v.status = "avail"';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getVehicleById(id) {
        const query = 'SELECT * FROM vehicles WHERE vehicle_id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    },
    async createVehicle(model,year,color,rides,rating,license_plate,price_per_day,status) {
        const query = 'INSERT INTO vehicles (model,year,color,rides,rating,license_plate, price_per_day,status) VALUES (?,?,?,?,?,?,?,?)';
        await pool.execute(query, [model,year,color,rides,rating,license_plate,price_per_day,status]);
    },
    async updateVehicle(id,type,brand,model,year,color,rides,rating,license_plate,price_per_day,status) {
        const query = 'UPDATE vehicles SET type = ?, brand = ?, model = ?, year = ?, color = ?, rides = ?, rating = ?, license_plate = ?, price_per_day = ?, status = ? WHERE id = ?';
        await pool.execute(query, [type,brand,model,year,color,rides,rating,license_plate,price_per_day,status,id]);
    },
    async deleteVehicle(id) {
        const query = 'DELETE FROM vehicles WHERE vehicle_id = ?';
        await pool.execute(query, [id]);
    }
};

module.exports = vehicleModel;