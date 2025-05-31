const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');

router.post('/doctors', doctorController.createDoctor);
router.get('/doctors/:id', doctorController.getDoctor); 
router.put('/doctors/:id', doctorController.updateDoctor); 
router.delete('/doctors/:id', doctorController.deleteDoctor);

router.get('/doctors/:id/schedule', doctorController.getDoctorSchedule); 

module.exports = router;