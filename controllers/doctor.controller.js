const { logger } = require("../utils/logger");
const doctorModel = require("../database/models/doctor.model");
const doctorSchedModel = require("../database/models/doctorsched.model");

exports.getDoctor = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const doctor = await doctorModel.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json(doctor);
    } catch (error) {
        logger.error("Error fetching doctor:", error);
        next(error);
    }
}

exports.createDoctor = async (req, res, next) => {
    try {
        const doctorData = req.body;
        const newDoctor = await doctorModel.create(doctorData);

        res.status(201).json({
            message: "Doctor created successfully",
            doctor: newDoctor
        });
    } catch (error) {
        logger.error("Error creating doctor:", error);
        next(error);
    }
}

exports.updateDoctor = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const doctorData = req.body;

        const updatedDoctor = await doctorModel.update(doctorId, doctorData);

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: "Doctor updated successfully",
            doctor: updatedDoctor
        });
    } catch (error) {
        logger.error("Error updating doctor:", error);
        next(error);
    }
}

exports.deleteDoctor = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const deletedDoctor = await doctorModel.delete(doctorId);

        if (!deletedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({
            message: "Doctor deleted successfully"
        });
    } catch (error) {
        logger.error("Error deleting doctor:", error);
        next(error);
    }
}

exports.getDoctorSchedule = async (req, res, next) => {
    try {
        const doctorId = req.params.id;
        const schedule = await doctorSchedModel.findById(doctorId);

        if (!schedule) {
            return res.status(404).json({ message: "Schedule not found for this doctor" });
        }

        res.status(200).json(schedule);
    } catch (error) {
        logger.error("Error fetching doctor schedule:", error);
        next(error);
    }
}