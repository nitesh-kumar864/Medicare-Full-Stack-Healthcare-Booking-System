import crypto from "crypto";
import { razorpayInstance } from "../../config/razorpay.config.js";

import {
  createAppointmentOrderService,
  createBedOrderService,
  verifyAppointmentPaymentService,
  verifyBedPaymentService,
  releaseAppointmentSlotService,
} from "../../services/payment/payment.service.js";

/* =========================CREATE ORDER ============================*/
export const createOrder = async (req, res) => {
  try {
    const { type, id } = req.body;

    if (!type || !id) {
      return res.json({ success: false, message: "Missing type or id" });
    }

    let amount = 0;

    if (type === "appointment") {
      amount = await createAppointmentOrderService(id);
    }

    if (type === "bed") {
      amount = await createBedOrderService(id);
    }

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `${type}:${id}`,
    });

    return res.json({ success: true, order });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};

/* ==================== VERIFY PAYMENT ============================ */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.json({
        success: false,
        message: "Missing payment details",
      });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const order = await razorpayInstance.orders.fetch(
      razorpay_order_id
    );
    const [type, id] = order.receipt.split(":");

    if (type === "appointment") {
      const result = await verifyAppointmentPaymentService(
        id,
        razorpay_payment_id
      );

      if (result === "ALREADY_PAID") {
        return res.json({ success: true, message: "Already paid" });
      }

      return res.json({
        success: true,
        message: "Appointment booked successfully",
      });
    }

    if (type === "bed") {
      const result = await verifyBedPaymentService(
        id,
        razorpay_payment_id
      );

      if (result === "ALREADY_PAID") {
        return res.json({ success: true, message: "Already paid" });
      }

      return res.json({
        success: true,
        message: "Bed booked successfully",
      });
    }

    return res.json({
      success: false,
      message: "Invalid payment type",
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};

/* ========================= RELEASE APPOINTMENT SLOT============================ */
export const releaseAppointmentSlot = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    await releaseAppointmentSlotService(appointmentId);

    return res.json({
      success: true,
      message: "Slot released",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
