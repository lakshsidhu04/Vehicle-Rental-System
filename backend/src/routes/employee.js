const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');

const employeeModel = require('../models/Employee');

router.get('/',auth, async (req, res) => {
    if(req.user.role!=='admin'){
        return res.status(403).json({message: 'Forbidden'});
    }
    try {
        const employees = await employeeModel.getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

router.get('/:id', auth, async (req, res) => {
    if(req.user.role!== 'employee'){
        return res.status(403).json({message: 'Forbidden'});
    }
    try {
        const employee = await employeeModel.getEmployeeById(req.user.id);
        console.log(employee);
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

router.patch('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if(req.user.role!=='admin'){
        return res.status(403).json({message: 'Forbidden'});
    }
    try {
        const employee = await employeeModel.updateEmployee(id, req.body);
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

router.post('/', auth, async (req, res) => {
    if(req.user.role!=='admin'){
        return res.status(403).json({message: 'Forbidden'});
    }
    try {
        const employee_id = await employeeModel.createEmployee(
            req.body.name,
            req.body.username,
            req.body.password,
            req.body.email,
            req.body.phone_number,
            req.body.role,
            req.body.salary,
            req.body.hire_date
        );
        res.json({ employee_id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

router.delete('/:id', auth, async (req,res) =>{
    if(req.user.role!=='admin'){
        return res.status(403).json({message: 'Forbidden'});
    }
    const id = req.params.id;
    try{
        console.log(id);
        const employee = await employeeModel.deleteEmployee(id);
        res.json(employee);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
})


module.exports = router;