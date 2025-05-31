const express = require('express');
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const oauthRoutes = require("./oauth.routes.js");
const otpRoutes = require("./otp.routes.js");

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/oauth", oauthRoutes);

module.exports = router;
