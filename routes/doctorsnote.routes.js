const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorsnote.controller');

router.post('/doctors/notes', doctorController.createDoctorsNote);
router.get('/doctors/notes/:id', doctorController.getDoctorsNote);
router.put('/doctors/notes/:id', doctorController.updateDoctorsNote);
router.delete('/doctors/notes/:id', doctorController.deleteDoctorsNote);

module.exports = router;