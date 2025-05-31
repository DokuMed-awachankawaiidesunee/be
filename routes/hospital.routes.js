const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital.controller');

router.get('/hospitals', hospitalController.getAllHospitals);
router.post('/hospitals', hospitalController.createHospital);
router.get('/hospitals/:id', hospitalController.getHospital);
router.put('/hospitals/:id', hospitalController.updateHospital);
router.delete('/hospitals/:id', hospitalController.deleteHospital);

module.exports = router;