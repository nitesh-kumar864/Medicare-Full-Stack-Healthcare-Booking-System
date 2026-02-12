import express from "express";
import authAny from "../middlewares/authAny.js";

import { 
    getMessageByAppointment,
    getUnreadCount,
 } from  "../controllers/message.controller.js";

const router = express.Router();

router.get("/:appointmentId", getMessageByAppointment);
router.get("/unread/:appointmentId",authAny, getUnreadCount);

export default router;
