import { GoogleGenAI } from "@google/genai";
const { logger } = require("../utils/logger");
const medicineModel = require("../database/models/medicine.model");
const medicineStockModel = require("../database/models/medicine_stock.model");

const gemini_api_key = `${process.env.GEMINI_API_KEY}`;
const ai = new GoogleGenAI({ apiKey: gemini_api_key });

exports.getMedicine = async (req, res, next) => {
    try {
        const medicineId = req.params.id;
        const medicine = await medicineModel.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json(medicine);
    } catch (error) {
        logger.error("Error fetching medicine:", error);
        next(error);
    }
}

exports.createMedicine = async (req, res, next) => {
    try {
        const medicineData = req.body;
        const newMedicine = await medicineModel.create(medicineData);
        res.status(201).json({
            message: "Medicine created successfully",
            medicine: newMedicine
        });
    } catch (error) {
        logger.error("Error creating medicine:", error);
        next(error);
    }
}

exports.updateMedicine = async (req, res, next) => {
    try {
        const medicineId = req.params.id;
        const medicineData = req.body;
        const updatedMedicine = await medicineModel.update(medicineId, medicineData);
        if (!updatedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json({
            message: "Medicine updated successfully",
            medicine: updatedMedicine
        });
    } catch (error) {
        logger.error("Error updating medicine:", error);
        next(error);
    }
}

exports.deleteMedicine = async (req, res, next) => {
    try {
        const medicineId = req.params.id;
        const deletedMedicine = await medicineModel.delete(medicineId);
        if (!deletedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json({
            message: "Medicine deleted successfully",
            medicine: deletedMedicine
        });
    } catch (error) {
        logger.error("Error deleting medicine:", error);
        next(error);
    }
}

exports.getMedicineStock = async (req, res, next) => {
    try {
        const stockId = req.params.id;
        const stock = await medicineStockModel.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Medicine stock not found" });
        }
        res.status(200).json(stock);
    } catch (error) {
        logger.error("Error fetching medicine stock:", error);
        next(error);
    }
}

exports.createMedicineStock = async (req, res, next) => {
    try {
        const stockData = req.body;
        const newStock = await medicineStockModel.create(stockData);
        res.status(201).json({
            message: "Medicine stock created successfully",
            stock: newStock
        });
    } catch (error) {
        logger.error("Error creating medicine stock:", error);
        next(error);
    }
}

exports.updateMedicineStock = async (req, res, next) => {
    try {
        const stockId = req.params.id;
        const stockData = req.body;
        const updatedStock = await medicineStockModel.update(stockId, stockData);
        if (!updatedStock) {
            return res.status(404).json({ message: "Medicine stock not found" });
        }
        res.status(200).json({
            message: "Medicine stock updated successfully",
            stock: updatedStock
        });
    } catch (error) {
        logger.error("Error updating medicine stock:", error);
        next(error);
    }
}

exports.deleteMedicineStock = async (req, res, next) => {
    try {
        const stockId = req.params.id;
        const deletedStock = await medicineStockModel.delete(stockId);
        if (!deletedStock) {
            return res.status(404).json({ message: "Medicine stock not found" });
        }
        res.status(200).json({
            message: "Medicine stock deleted successfully",
            stock: deletedStock
        });
    } catch (error) {
        logger.error("Error deleting medicine stock:", error);
        next(error);
    }
}

exports.predictMedicineStock = async (req, res, next) => {
    try {
        const userQuery = req.body;
        const geminiPrompt = `You are a medical expert. Given the following medicine details, predict the stock requirements. Medicine: ${userQuery.medicineName}, Current Stock: ${userQuery.currentStock}, Demand Forecast: ${userQuery.demandForecast}`;

        const response = await ai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: geminiPrompt,
                },
            ],
            maxOutputTokens: 1000,
            temperature: 0.2,
        });

        res.status(200).json({
            prediction: response.choices[0].message.content
        });
    } catch (error) {
        logger.error("Error predicting medicine stock:", error);
        next(error);
    }
}