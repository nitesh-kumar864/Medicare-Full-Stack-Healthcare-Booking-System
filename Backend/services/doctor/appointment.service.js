import appointmentModel from "../../models/appointmentModel.js";
import doctorModel from "../../models/doctorModel.js";

import sendEmail from "../../mail/sendEmail.js";
import { AppointmentCompletedTemplate } from "../../mail/emailTemplates/AppointmentCompleted.js";
import { appointmentCancelledTemplate } from "../../mail/emailTemplates/appointmentCancelled.js";


// ================= GET DOCTOR APPOINTMENTS =================
export const appointmentDoctorService = async (doctorId) => {
  const appointments = await appointmentModel.find({ docId: doctorId });

  return {
    success: true,
    appointments,
  };
};

// ================= COMPLETE APPOINTMENT =================
export const appointmentCompleteService = async (
  doctorId,
  appointmentId
) => {
  const appointment = await appointmentModel.findById(appointmentId);

  if (!appointment) {
    return {
      success: false,
      message: "Appointment not found",
    };
  }

  if (appointment.docId.toString() !== doctorId.toString()) {
    return {
      success: false,
      message: "Unauthorized action",
    };
  }

  // Prevent duplicate completion
  if (appointment.isCompleted) {
    return {
      success: true,
      message: "Already completed",
    };
  }

  //Update appointment
  appointment.isCompleted = true;
  appointment.payment = true;
  appointment.paymentMethod = "cash";
  appointment.status = "completed";

  await appointment.save();

  await doctorModel.findByIdAndUpdate(appointment.docId, {
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
  });

  console.log("Sending email to:", appointment.userData?.email);

  // Send Email
  await sendEmail({
    to: appointment.userData.email,
    subject: "Appointment Completed (Cash Payment)",
    html: AppointmentCompletedTemplate(appointment),
  });

  return {
    success: true,
    message: "Appointment completed & email sent",
  };
};


// ================= CANCEL APPOINTMENT =================
export const appointmentCancelService = async (
  doctorId,
  appointmentId
) => {
  const appointment = await appointmentModel.findById(appointmentId);

  if (!appointment) {
    return {
      success: false,
      message: "Appointment not found",
    };
  }

  if (appointment.docId.toString() !== doctorId.toString()) {
    return {
      success: false,
      message: "Unauthorized action",
    };
  }

  await appointmentModel.findByIdAndUpdate(appointmentId, {
    cancelled: true,
    status: "cancelled",
    payment: false,
    isCompleted: false,
    paymentMethod: "none",
  });

  // Send Email
  await sendEmail({
    to: appointment.userData.email,
    subject: "Appointment Cancelled",
    html: appointmentCancelledTemplate(appointment),
  });


  return {
    success: true,
    message: "Appointment cancelled successfully",
  };
};

