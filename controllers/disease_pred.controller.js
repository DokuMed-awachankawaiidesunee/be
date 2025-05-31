import { GoogleGenAI } from "@google/genai";

const { logger } = require("../utils/logger");
const predictionModel = require("../database/models/disease_pred.model");
const symptomModel = require("../database/models/symptom.model");

const gemini_api_key = `${process.env.GEMINI_API_KEY}`;
const ai = new GoogleGenAI({ apiKey: gemini_api_key });

exports.getDiseasePrediction = async (req, res, next) => {
    try {
        user_query = req.body
        gemini_prompt = `You are a medical expert. Given the following symptoms, provide a diagnosis and suggest possible treatments. Symptoms: ${user_query.symptoms}. Age: ${user_query}`

        const response = await ai.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: [
                {
                    role: "user",
                    content: gemini_prompt,
                },
            ],
            maxOutputTokens: 1000,
            temperature: 0.2,
        });
    } catch (error) {
        next(error)
    }
}

exports.getPredictions = async (req, res, next) => {
    try {
        const predictions = await predictionModel.findAll();
        res.status(200).json(predictions);
    } catch (error) {
        logger.error("Error fetching predictions:", error);
        next(error);
    }
}