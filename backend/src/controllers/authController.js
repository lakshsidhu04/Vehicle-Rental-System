const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email , role: user.role}, dotenv.parsed.SECRET_KEY, {
        expiresIn: '30d'
    });
}

module.exports = generateToken;