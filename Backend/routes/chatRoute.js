import express from "express";
import { getMessageByAppointment } from  "../controllers/message.controller.js";

const router = express.Router();

router.get("/:appointmentId", getMessageByAppointment);

export default router;
