const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const auth = require('../middlewares/authMiddleware');
router.get('/', async(req, res) => {
    try {
        const vehicles = await Vehicle.getVehiclesWithModelBrand();
        res.json(vehicles);
    } catch (error) {
        res.json({ message: error });
    }
})

router.get('/get/:id', async(req, res) => {
    try {
        const vehicle = await Vehicle.getVehicleById(req.params.id);
        res.json(vehicle);
    } catch (error) {
        res.json({ message: error });
    }
})

router.get('/admin', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(401).send('Access Denied: Only Admins can view all vehicles');
    }

    try {
        const allVehicles = await Vehicle.getAllVehiclesForAdmin();
        res.json(allVehicles);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: error.message });
    
    }
});


router.get('/admin/models', auth, async(req, res) => {
    if(req.user.role !== 'admin'){
        return res.status(401).send('Access Denied: Only Admins can view vehicle models');
    }
    try {
        const models = await Vehicle.getModels();
        res.json(models);
    } catch (error) {
        res.json({ message: error });
    }
}
);

router.post('/add' , auth, async(req, res) => {
    try{
        if(req.user.role !== 'admin'){
            return res.status(401).send('Access Denied: Only Admins can add vehicles');
        }
        console.log(req.body);
        await Vehicle.addModel(req.body.vehicleBrand, req.body.vehicleModel, req.body.vehicleType);
        await Vehicle.createVehicle(req.body.vehicleModel,req.body.vehicleYear,req.body.vehicleColor,req.body.vehicleRides,req.body.vehicleRating,req.body.vehicleLicensePlate,req.body.vehiclePricePerDay,req.body.vehicleStatus);

        res.json({ message: 'Vehicle added successfully' });
    }
    catch(error){
        console.error("Database error:", error);
        res.json({ message: error });
    }
})

router.delete('/:id', auth, async(req, res) => {
    try {
        if(req.user.role !== 'admin'){
            return res.status(401).send('Access Denied: Only Admins can delete vehicles');
        }
        await Vehicle.deleteVehicle(req.params.id);
        res.json(removedVehicle);
    } catch (error) {
        res.json({ message: error });
    }
}
)

router.patch('/:id', auth, async(req, res) => {
    try {
        if(req.user.role !== 'admin'){
            return res.status(401).send('Access Denied: Only Admins can update vehicles');
        }
        const updatedVehicle = await Vehicle.updateOne({ _id: req.params.id }, { $set: { vehicleName: req.body.vehicleName, vehicleType: req.body.vehicleType, vehicleModel: req.body.vehicleModel, vehicleNumber: req.body.vehicleNumber, vehicleColor: req.body.vehicleColor, vehiclePrice: req.body.vehiclePrice, vehicleImage: req.body.vehicleImage } });
        res.json(updatedVehicle);
    } catch (error) {
        res.json({ message: error });
    }
}
)

module.exports = router;

