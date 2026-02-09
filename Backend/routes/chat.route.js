import express from "express";
import authUser from "../middlewares/authUser.js";
import messageModel from "../models/messageModel.js";

const router = express.Router();

router.get("/:appointmentId", authUser, async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const messages = await messageModel
      .find({ appointmentId })
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
