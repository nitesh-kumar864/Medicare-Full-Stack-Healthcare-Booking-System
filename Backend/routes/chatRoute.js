import express from "express";
import authAny from "../middlewares/authAny.js";
import chatUpload from "../middlewares/chatUpload.js";

import {
  getMessageByAppointment,
  getUnreadCount,
  uploadChatFileController,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:appointmentId", getMessageByAppointment);
router.get("/unread/:appointmentId", authAny, getUnreadCount);

router.post(
  "/upload/:appointmentId",
  authAny,
  chatUpload.single("file"),
  uploadChatFileController
);


export default router;
