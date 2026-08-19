import express from "express";
import { chatWithAI } from "../controllers/chatbotController.js";
const router = express.Router();

router.post("/ai", chatWithAI);

export default router;