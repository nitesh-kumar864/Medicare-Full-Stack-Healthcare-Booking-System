import express from "express";
import authUser from "../middlewares/authUser.js";

import {
  createOrder,
  verifyPayment,
  releaseAppointmentSlot,
} from "../controllers/payment/payment.controller.js";

const router = express.Router();

router.post("/create-order", authUser, createOrder);

router.post("/verify-payment", authUser, verifyPayment);

router.post(
  "/release-appointment-slot", authUser, releaseAppointmentSlot);

export default router;
