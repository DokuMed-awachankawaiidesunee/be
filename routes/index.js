const express = require('express');
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const oauthRoutes = require("./oauth.routes.js");
const otpRoutes = require("./otp.routes.js");
const userRoutes = require("./user.routes.js");
const diseaseRoutes = require("./disease_pred.routes.js");
const doctorRoutes = require("./doctor.routes.js");
const hospitalRoutes = require("./hospital.routes.js");
const medicineRoutes = require("./medicine.routes.js");
const doctorsnoteRoutes = require("./doctorsnote.routes.js");

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/oauth", oauthRoutes);
router.use("/users", userRoutes);
router.use("/disease", diseaseRoutes);
router.use("/doctors", doctorRoutes);
router.use("/hospitals", hospitalRoutes);
router.use("/medicines", medicineRoutes);
router.use("/doctorsnote", doctorsnoteRoutes);

module.exports = router;
