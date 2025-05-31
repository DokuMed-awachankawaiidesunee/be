const { logger } = require("../utils/logger");
const doctosNoteModel = require("../database/models/doctorsnote.model");

exports.getDoctorsNote = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const note = await doctosNoteModel.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: "Doctors Note not found" });
        }

        res.status(200).json(note);
    } catch (error) {
        logger.error("Error fetching Doctors Note:", error);
        next(error);
    }
}

exports.createDoctorsNote = async (req, res, next) => {
    try {
        const noteData = req.body;
        const newNote = await doctosNoteModel.create(noteData);

        res.status(201).json({
            message: "Doctors Note created successfully",
            note: newNote
        });
    } catch (error) {
        logger.error("Error creating Doctors Note:", error);
        next(error);
    }
}

exports.updateDoctorsNote = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const noteData = req.body;

        const updatedNote = await doctosNoteModel.update(noteId, noteData);

        if (!updatedNote) {
            return res.status(404).json({ message: "Doctors Note not found" });
        }

        res.status(200).json({
            message: "Doctors Note updated successfully",
            note: updatedNote
        });
    } catch (error) {
        logger.error("Error updating Doctors Note:", error);
        next(error);
    }
}

exports.deleteDoctorsNote = async (req, res, next) => {
    try {
        const noteId = req.params.id;
        const deletedNote = await doctosNoteModel.delete(noteId);

        if (!deletedNote) {
            return res.status(404).json({ message: "Doctors Note not found" });
        }

        res.status(200).json({
            message: "Doctors Note deleted successfully",
            note: deletedNote
        });
    } catch (error) {
        logger.error("Error deleting Doctors Note:", error);
        next(error);
    }
}