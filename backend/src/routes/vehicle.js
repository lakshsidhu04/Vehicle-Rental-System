const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

router.get('/', async(req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.json({ message: error });
    }
})

router.get('/:id', async(req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        res.json(vehicle);
    } catch (error) {
        res.json({ message: error });
    }
})

