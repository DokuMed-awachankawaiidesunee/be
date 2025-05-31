const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/users', userController.createProfile);
router.get('/users/:id', userController.getProfile);
router.put('/users/:id', userController.updateProfile);
router.delete('/users/:id', userController.deleteProfile);

router.get('/users/:id/symptoms-records', userController.getSymptomsRecords);

module.exports = router;