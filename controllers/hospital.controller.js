const { logger } = require("../utils/logger");
const HospitalModel = require("../database/models/hospital.model");

exports.getHospital = async (req, res, next) => {
    try {
        const hospitalId = req.params.id;
        const hospital = await HospitalModel.findById(hospitalId);

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json(hospital);
    } catch (error) {
        logger.error("Error fetching hospital:", error);
        next(error);
    }
}

exports.createHospital = async (req, res, next) => {
    try {
        const hospitalData = req.body;
        const newHospital = await HospitalModel.create(hospitalData);

        res.status(201).json({
            message: "Hospital created successfully",
            hospital: newHospital
        });
    } catch (error) {
        logger.error("Error creating hospital:", error);
        next(error);
    }
}

exports.updateHospital = async (req, res, next) => {
    try {
        const hospitalId = req.params.id;
        const hospitalData = req.body;

        const updatedHospital = await HospitalModel.update(hospitalId, hospitalData);

        if (!updatedHospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json({
            message: "Hospital updated successfully",
            hospital: updatedHospital
        });
    } catch (error) {
        logger.error("Error updating hospital:", error);
        next(error);
    }
}

exports.deleteHospital = async (req, res, next) => {
    try {
        const hospitalId = req.params.id;
        const deletedHospital = await HospitalModel.delete(hospitalId);

        if (!deletedHospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json({
            message: "Hospital deleted successfully",
            hospital: deletedHospital
        });
    } catch (error) {
        logger.error("Error deleting hospital:", error);
        next(error);
    }
}

exports.getAllHospitals = async (req, res, next) => {
    try {
        const hospitals = await HospitalModel.findAll();
        res.status(200).json(hospitals);
    } catch (error) {
        logger.error("Error fetching hospitals:", error);
        next(error);
    }
}