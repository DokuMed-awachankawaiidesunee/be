const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

router.post('/send-otp', otpController.sendOtpWhatsApp);
router.post('/verify-otp', otpController.verifyOtpWhatsApp);

module.exports = router;
