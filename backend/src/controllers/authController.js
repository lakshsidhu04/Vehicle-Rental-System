const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username:user.username, role: user.role}, dotenv.parsed.JWT_SECRET, {
        expiresIn: '30d'
    });
}

module.exports = generateToken;