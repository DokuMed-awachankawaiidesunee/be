const { logger } = require("../utils/logger");
const userModel = require("../database/models/user.model");

exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

exports.createProfile = async (req, res, next) => {
    try {
        const userData = req.body;
        const newUser = await userModel.create(userData);

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        next(error);
    }
}

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userData = req.body;

        const updatedUser = await userModel.update(userId, userData);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const deletedUser = await userModel.delete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

exports.getSymptomsRecords = async (req, res, next) => {

}