const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const generateToken = (user) => {
    