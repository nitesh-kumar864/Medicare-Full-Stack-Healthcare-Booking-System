import appointmentModel from "../../models/appointmentModel.js";

// ================= DOCTOR DASHBOARD =================
export const doctorDashboardService = async (doctorId) => {
 
  const appointments = await appointmentModel.find({ docId: doctorId });

  // Calculate earnings
  let earnings = 0;
  appointments.forEach((appt) => {
    if (!appt.cancelled && (appt.isCompleted || appt.payment)) {
      earnings += Number(appt.amount || 0);
    }
  });

  // Unique patients count
  const uniquePatients = new Set(
    appointments.map((a) => a.userId.toString())
  );

  // Latest 5 appointments
  const latestAppointments = [...appointments]
    .reverse()
    .slice(0, 5);

  return {
    success: true,
    dashData: {
      earnings,
      appointments: appointments.length,
      patients: uniquePatients.size,
      latestAppointments,
    },
  };
};
