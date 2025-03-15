const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const auth = require('../middlewares/authMiddleware');
router.get('/', async(req, res) => {
    try {
        const vehicles = await Vehicle.getVehicles();
        res.json(vehicles);
    } catch (error) {
        res.json({ message: error });
    }
})

router.get('/:id', async(req, res) => {
    try {
        const vehicle = await Vehicle.getVehicleById(req.params.id);
        res.json(vehicle);
    } catch (error) {
        res.json({ message: error });
    }
})

router.post('/add' , auth, async(req, res) => {
    try{
        await Vehicle.createVehicle(req.body.vehicleType,req.body.vehicleBrand,req.body.vehicleModel,req.body.vehicleYear,req.body.vehicleColor,req.body.vehicleRides,req.body.vehicleRating,req.body.vehicleLicensePlate,req.body.vehiclePricePerDay,req.body.vehicleStatus);
        res.json({ message: 'Vehicle added successfully' });
    }
    catch(error){
        res.json({ message: error });
    }
})

router.delete('/:id', auth, async(req, res) => {
    try {
        await Vehicle.deleteVehicle(req.params.id);
        res.json(removedVehicle);
    } catch (error) {
        res.json({ message: error });
    }
}
)

router.patch('/:id', auth, async(req, res) => {
    try {
        const updatedVehicle = await Vehicle.updateOne({ _id: req.params.id }, { $set: { vehicleName: req.body.vehicleName, vehicleType: req.body.vehicleType, vehicleModel: req.body.vehicleModel, vehicleNumber: req.body.vehicleNumber, vehicleColor: req.body.vehicleColor, vehiclePrice: req.body.vehiclePrice, vehicleImage: req.body.vehicleImage } });
        res.json(updatedVehicle);
    } catch (error) {
        res.json({ message: error });
    }
}
)

module.exports = router;

