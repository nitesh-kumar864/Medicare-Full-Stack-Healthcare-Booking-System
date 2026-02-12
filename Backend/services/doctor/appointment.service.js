import appointmentModel from "../../models/appointmentModel.js";

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

  await appointmentModel.findByIdAndUpdate(appointmentId, {
    isCompleted: true,
    payment: true,
    paymentMethod: "cash",
    status: "completed",
  });

  return {
    success: true,
    message: "Appointment completed successfully",
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

  return {
    success: true,
    message: "Appointment cancelled successfully",
  };
};

