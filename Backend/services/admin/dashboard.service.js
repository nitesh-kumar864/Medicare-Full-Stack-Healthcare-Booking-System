import doctorModel from "../../models/doctorModel.js";
import userModel from "../../models/userModel.js";
import appointmentModel from "../../models/appointmentModel.js";
import Booking from "../../models/BookingModel.js";


// ================= ADMIN DASHBOARD DATA =================
export const adminDashboardService = async () => {
  const doctors = await doctorModel.find({});
  const users = await userModel.find({});
  const appointments = await appointmentModel.find({});

  // TOTAL REVENUE CALCULATION 
  let totalRevenue = 0;

  appointments.forEach((appt) => {
    if (
      !appt.cancelled &&
      (appt.payment === true || appt.isCompleted === true)
    ) {
      totalRevenue += Number(appt.amount || 0);
    }
  });

  const dashData = {
    doctors: doctors.length,
    patients: users.length,
    appointments: appointments.length,
    revenue: totalRevenue,
    latestAppointments: appointments.slice().reverse().slice(0, 5),
  };

  return {
    success: true,
    dashData,
  };
};

// ================= BED REVENUE =================
export const getBedRevenueService = async () => {
  const bookings = await Booking.find();

  let bedRevenue = 0;

  bookings.forEach((b) => {
    const isPaid =
      b.payment === true ||
      b.status === "paid" ||
      Boolean(b.paymentId);

    if (isPaid && b.status !== "cancelled") {
      bedRevenue += Number(b.price || 0);
    }
  });

  return {
    success: true,
    bedRevenue,
  };
};