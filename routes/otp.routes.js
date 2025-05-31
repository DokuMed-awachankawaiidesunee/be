const express = require('express');
const router = express.Router();

const { sendOtpHandler, verifyOtpWhatsApp } = require('../controllers/otp.controller');

router.post('/send', sendOtpHandler);
router.post('/verify', verifyOtpWhatsApp);

module.exports = router;
