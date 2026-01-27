import {
  bookAppointmentService,
  listAppointmentService,
  cancelAppointmentService,
} from "../../services/user/appointment.service.js";

//  BOOK APPOINTMENT
export const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;

    const result = await bookAppointmentService(userId, data);
    return res.json(result);
  } catch (error) {
    console.error("Book appointment error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//  LIST USER APPOINTMENTS 
export const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await listAppointmentService(userId);
    return res.json(result);
  } catch (error) {
    console.error("List appointment error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

//  CANCEL APPOINTMENT 
export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const result = await cancelAppointmentService(userId, appointmentId);
    return res.json(result);
  } catch (error) {
    console.error("Cancel appointment error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
