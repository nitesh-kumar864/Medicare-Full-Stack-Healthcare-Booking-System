import appointmentModel from "../../models/appointmentModel.js";
import doctorModel from "../../models/doctorModel.js";
import userModel from "../../models/userModel.js";

import sendEmail from "../../mail/sendEmail.js";
import { appointmentCancelledTemplate } from "../../mail/emailTemplates/appointmentCancelled.js";
import { DoctorAppointmentCancelledTemplate } from "../../mail/emailTemplates/DoctorAppointmentCancelled.js";

// --------------- BOOK APPOINTMENT ---------------
export const bookAppointmentService = async (userId, data) => {
  const { docId, slotDate, slotTime } = data;

  if (!docId || !slotDate || !slotTime) {
    return { success: false, message: "Missing data" };
  }

  // CHECK EXISTING PENDING APPOINTMENT 
  const alreadyLocked = await appointmentModel.findOne({
    userId,
    docId,
    slotDate,
    payment: false,
    cancelled: false,
  });

  if (alreadyLocked) {
    return {
      success: false,
      message:
        "You already have a pending slot for this doctor on this date. Please complete or cancel it first.",
    };
  }

  //  ATOMIC SLOT LOCK 
  const lockedDoctor = await doctorModel.findOneAndUpdate(
    {
      _id: docId,
      available: true,
      slots_booked: {
        $not: { $elemMatch: { date: slotDate, time: slotTime } },
      },
      slots_locked: {
        $not: { $elemMatch: { date: slotDate, time: slotTime } },
      },
    },
    {
      $push: {
        slots_locked: {
          date: slotDate,
          time: slotTime,
          lockedAt: new Date(),
        },
      },
    },
    { new: true }
  );

  if (!lockedDoctor) {
    return {
      success: false,
      message: "Slot already booked or in progress",
    };
  }

  const userData = await userModel.findById(userId).select("-password");

  // CREATE APPOINTMENT 
  const appointment = await appointmentModel.create({
    userId,
    docId,
    userData,
    doctorData: lockedDoctor.toObject(),
    amount: lockedDoctor.fees,
    slotDate,
    slotTime,
    status: "pending",
    payment: false,
  });

  // AUTO RELEASE SLOT 
  setTimeout(async () => {
    const appt = await appointmentModel.findById(appointment._id);

    if (appt && !appt.payment) {
      await doctorModel.findByIdAndUpdate(appt.docId, {
        $pull: {
          slots_locked: {
            date: appt.slotDate,
            time: appt.slotTime,
          },
        },
      });

      await appt.deleteOne();
    }
  }, 3 * 60 * 1000);

  return {
    success: true,
    message: "Slot locked. Complete payment.",
    appointmentId: appointment._id,
  };
};


// ------------------ LIST USER APPOINTMENTS ------------------
export const listAppointmentService = async (userId) => {
  const appointments = await appointmentModel.find({ userId });

  return {
    success: true,
    appointments,
  };
};


// ------------------ CANCEL APPOINTMENT ------------------
export const cancelAppointmentService = async (userId, appointmentId) => {
  if (!appointmentId) {
    return { success: false, message: "Appointment ID is required" };
  }

  const appointment = await appointmentModel.findById(appointmentId);

  if (!appointment) {
    return { success: false, message: "Appointment not found" };
  }

  if (appointment.userId.toString() !== userId.toString()) {
    return { success: false, message: "Unauthorized" };
  }

  if (appointment.status === "cancelled") {
    return { success: true, message: "Already cancelled" };
  }

  // ---- RELEASE SLOT ----
  await doctorModel.findByIdAndUpdate(appointment.docId, {
    $pull: {
      slots_booked: {
        date: appointment.slotDate,
        time: appointment.slotTime,
      },
      slots_locked: {
        date: appointment.slotDate,
        time: appointment.slotTime,
      },
    },
  });

  // ---- MARK APPOINTMENT CANCELLED ----
  appointment.status = "cancelled";
  appointment.cancelled = true;
  await appointment.save();

    await sendEmail({
    to: appointment.userData.email,
    subject: "Appointment Cancelled",
    html: appointmentCancelledTemplate(appointment),
  });

  // Send to Doctor
    await sendEmail({
    to: appointment.doctorData.email,
    subject: "Appointment Cancelled",
    html: DoctorAppointmentCancelledTemplate(appointment),
  });

  return {
    success: true,
    message: "Appointment cancelled & slot released immediately",
  };
};