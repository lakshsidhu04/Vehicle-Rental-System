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
    async getAllVehiclesForAdmin() {
        const query = `
    SELECT 
        v.vehicle_id, v.model, v.year, v.color, v.rides, v.license_plate, 
        v.price_per_day, v.status, m.brand, m.vehicle_type,
        COALESCE(AVG(b.rating), 0) AS rating 
    FROM vehicles AS v
    JOIN vehicle_models AS m ON v.model = m.model
    LEFT JOIN bookings AS b ON v.vehicle_id = b.vehicle_id
    GROUP BY v.vehicle_id, m.brand, m.vehicle_type
`;

        const [rows] = await pool.execute(query);
        return rows;
    },
    async getVehicleRating(vehicle_id) {
        // get individual booking ratings for the vehicle
        const query = 'SELECT SUM(rating) FROM bookings WHERE vehicle_id = ?';
        const [rows] = await pool.execute(query, [vehicle_id]);
        const totalRating = rows[0]['SUM(rating)'];

        // number of rated rides
        const query2 = 'SELECT rated_rides FROM vehicles WHERE vehicle_id = ?';
        const [rows2] = await pool.execute(query2, [vehicle_id]);
        const ratedRides = rows2[0].rated_rides;

        // get vehicle rating
        return totalRating / ratedRides;
    },
    async getMaintenance() {
        const query = `SELECT * FROM vehicles WHERE status = 'maintenance'`;
        const [rows] = await pool.execute(query);
        return rows;
    },
    async addVehicleRating(vehicle_id, rating, booking_id) {
        // previous rating
        const query = 'SELECT rating FROM vehicles WHERE vehicle_id = ?';
        const [rows] = await pool.execute(query, [vehicle_id]);
        const previousRating = rows[0].rating;

        // previous rides
        const query2 = 'SELECT rated_rides FROM vehicles WHERE vehicle_id = ?';
        const [rows2] = await pool.execute(query2, [vehicle_id]);
        const previousRides = rows2[0].rated_rides;

        // new rating
        const newRating = (previousRating * previousRides + rating) / (previousRides + 1);
        const newRides = previousRides + 1;
        const affectedRows = await pool.execute('UPDATE vehicles SET rating = ?, rated_rides = ? WHERE vehicle_id = ?', [newRating, newRides, vehicle_id]);
        return affectedRows;
    },

    async updateRating(vehicle_id, rating, booking_id) {
        // previous rating
        const query = 'SELECT rating FROM vehicles WHERE vehicle_id = ?';
        const [rows] = await pool.execute(query, [vehicle_id]);
        const previousRating = rows[0].rating;

        // previous rides
        const query2 = 'SELECT rated_rides FROM vehicles WHERE vehicle_id = ?';
        const [rows2] = await pool.execute(query2, [vehicle_id]);
        const previousRides = rows2[0].rated_rides;

        // new rating
        const newRating = (previousRating * previousRides + rating) / (previousRides + 1);
    },

    async addModel(brand, model, vehicle_type) {
        const query = 'INSERT INTO vehicle_models (brand, model, vehicle_type) VALUES (?,?,?)';
        await pool.execute(query, [brand, model, vehicle_type]);
    },
    async getModels() {
        const query = 'SELECT * FROM vehicle_models';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getMaintainenceVehicles() {
        const query = 'SELECT v.vehicle_id, v.model, v.year, v.color,v.rides,v.rating,v.license_plate,v.price_per_day, m.brand,m.vehicle_type FROM vehicles AS v, vehicle_models AS m WHERE v.model = m.model AND v.status = "maintenance"';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getVehiclesWithModelBrand() {
        const query = 'SELECT v.vehicle_id, v.model, v.year, v.color,v.rides,v.rating,v.license_plate,v.price_per_day, m.brand,m.vehicle_type FROM vehicles AS v, vehicle_models AS m WHERE v.model = m.model AND v.status = "avail"';
        const [rows] = await pool.execute(query);
        return rows;
    },
    async getVehicleById(id) {
        const query = 'SELECT * FROM vehicles WHERE vehicle_id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    },
    async createVehicle(model, year, color, rides, rating, license_plate, price_per_day, status) {
        const query = 'INSERT INTO vehicles (model,year,color,rides,rating,license_plate, price_per_day,status) VALUES (?,?,?,?,?,?,?,?)';
        await pool.execute(query, [model, year, color, rides, rating, license_plate, price_per_day, status]);
    },
    async updateVehicle(id, model, year, color, rides, rating, license_plate, price_per_day, status) {
        const query = 'UPDATE vehicles SET type = ?, brand = ?, model = ?, year = ?, color = ?, rides = ?, rating = ?, license_plate = ?, price_per_day = ?, status = ? WHERE vehicle_id = ?';
        await pool.execute(query, [type, brand, model, year, color, rides, rating, license_plate, price_per_day, status, id]);
    },
    async deleteVehicle(id) {
        const query = 'DELETE FROM vehicles WHERE vehicle_id = ?';
        await pool.execute(query, [id]);
    }
};

module.exports = vehicleModel;