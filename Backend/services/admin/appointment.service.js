import appointmentModel from "../../models/appointmentModel.js";
import doctorModel from "../../models/doctorModel.js";


// ================= GET ALL APPOINTMENTS =================
export const appointmentsAdminService = async () => {
  const appointments = await appointmentModel.find({});

  return {
    success: true,
    appointments,
  };
};

// ================= CANCEL APPOINTMENT =================
export const appointmentCancelService = async (appointmentId) => {
  if (!appointmentId) {
    return {
      success: false,
      message: "Appointment ID is required",
    };
  }

  const appointment = await appointmentModel.findById(appointmentId);

  if (!appointment) {
    return {
      success: false,
      message: "Appointment not found",
    };
  }

 
  if (appointment.cancelled === true) {
    return {
      success: true,
      message: "Appointment already cancelled",
    };
  }

  // ---- MARK APPOINTMENT CANCELLED ----
  appointment.cancelled = true;
  await appointment.save();

  // ---- RELEASE DOCTOR SLOT ----
  const { docId, slotDate, slotTime } = appointment;

  const doctor = await doctorModel.findById(docId);
  if (doctor && doctor.slots_booked?.[slotDate]) {
    doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
      (time) => time !== slotTime
    );

    await doctor.save();
  }

  return {
    success: true,
    message: "Appointment cancelled successfully",
  };
};
