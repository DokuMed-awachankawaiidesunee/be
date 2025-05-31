const express = require('express');
const router = express.Router();

const authRoutes = require("./auth.routes");
const oauthRoutes = require("./oauth.routes");
const otpRoutes = require("./otp.routes");

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/oauth", oauthRoutes);

module.exports = router;
