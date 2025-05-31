const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/prediction.controller');

router.post('/predict', predictionController.getDiseasePrediction);

router.get('/predictions', predictionController.getPredictions);

module.exports = router;