import appointmentModel from "../../models/appointmentModel.js";
import doctorModel from "../../models/doctorModel.js";
import Bed from "../../models/bedModel.js";
import Booking from "../../models/BookingModel.js";

import sendEmail from "../../mail/sendEmail.js";
import { AppointmentCompletedTemplate } from "../../mail/emailTemplates/AppointmentCompleted.js";
import { bedBookingSuccessTemplate } from "../../mail/emailTemplates/bedBookingSuccess.js";

/* =========================CREATE APPOINTMENT ORDER============================= */
export const createAppointmentOrderService = async (id) => {
  const appointment = await appointmentModel.findById(id);

  if (!appointment) {
    throw new Error("Invalid or expired appointment booking");
  }

  appointment.status = "pending";
  await appointment.save();

  return appointment.amount;
};

/* ===================== CREATE BED ORDER============================== */
export const createBedOrderService = async (id) => {
  const booking = await Booking.findById(id);

  if (
    !booking ||
    booking.status !== "locked" ||
    booking.lockExpiresAt < Date.now()
  ) {
    throw new Error("Invalid or expired bed booking");
  }

  return booking.price;
};

/* ===========================VERIFY APPOINTMENT PAYMENT========================== */
export const verifyAppointmentPaymentService = async (
  id,
  paymentId
) => {
  const appointment = await appointmentModel.findById(id);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // double payment protection
  if (appointment.payment) {
    return "ALREADY_PAID";
  }

  appointment.payment = true;
  appointment.paymentMethod = "online";
  appointment.status = "booked";
  appointment.transactionId = paymentId;
  await appointment.save();

  await doctorModel.findByIdAndUpdate(
    appointment.docId,
    {
      $pull: {
        slots_locked: {
          date: appointment.slotDate,
          time: appointment.slotTime,
        },
      },
      $push: {
        slots_booked: {
          date: appointment.slotDate,
          time: appointment.slotTime,
        },
      },
    }
  );

  await sendEmail({
    to: appointment.userData.email,
    subject: "Appointment Payment Successful",
    html: AppointmentCompletedTemplate(appointment),
  });

  return "SUCCESS";
};

/* ==========================VERIFY BED PAYMENT========================= */
export const verifyBedPaymentService = async (
  id,
  paymentId
) => {
  const booking = await Booking.findById(id);

  if (
    !booking ||
    booking.status !== "locked" ||
    booking.lockExpiresAt < Date.now()
  ) {
    throw new Error("Booking expired");
  }

  // double payment protection
  if (booking.payment) {
    return "ALREADY_PAID";
  }

  booking.status = "booked";
  booking.payment = true;
  booking.paymentId = paymentId;
  booking.lockedBy = null;
  booking.lockExpiresAt = null;

  await booking.save();

  await Bed.findOneAndUpdate(
    {},
    {
      $inc: {
        occupiedBeds: 1,
        [`bedTypes.${booking.bedType}.occupied`]: 1,
      },
      $addToSet: { occupiedNumbers: booking.bedNumber },
    }
  );

  await sendEmail({
    to: booking.email,
    subject: "Bed Booking Confirmed",
    html: bedBookingSuccessTemplate(booking),
  });

  return "SUCCESS";
};

/* ======================== RELEASE APPOINTMENT SLOT============================= */
export const releaseAppointmentSlotService = async (
  appointmentId
) => {
  const appointment = await appointmentModel.findById(appointmentId);

  if (!appointment || appointment.payment) {
    throw new Error("Invalid appointment");
  }

  // unlock slot
  await doctorModel.findByIdAndUpdate(
    appointment.docId,
    {
      $pull: {
        slots_locked: {
          date: appointment.slotDate,
          time: appointment.slotTime,
        },
      },
    }
  );

  // delete appointment
  await appointment.deleteOne();
};
