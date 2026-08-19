import { generateAIResponse } from "../services/ai.Service.js";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body || {};

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const answer = await generateAIResponse(message);

        return res.status(200).json({
            success: true,
            answer,
        });
    } catch (error) {
        console.error("Chatbot Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to get AI response",
        });
    }
};