const pool = require('../config/db');

const earningsModel = {
    async getEarnings() {
        try {
            const query = 'SELECT * FROM earnings';
            const [rows] = await pool.execute(query);
            return rows;
        }
        catch (error) {
            console.error(error);
        }
    }
}

module.exports = earningsModel;