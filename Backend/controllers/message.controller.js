import appointmentModel from "../models/appointmentModel.js";
import {
  getMessageByAppointmentService,
  getUnreadCountService
} from "../services/message.service.js";

export const getMessageByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const messages = await getMessageByAppointmentService(appointmentId);

    // Fetch appointment with doctorData + userData
    const appointment = await appointmentModel
      .findById(appointmentId)
      .select("doctorData userData");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      messages,
      doctor: appointment.doctorData,
      user: appointment.userData,
    });

  } catch (error) {
    console.log("Get message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load messages",
    });
  }
};



export const getUnreadCount = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const role = req.user?.role;

    const count = await getUnreadCountService(appointmentId, role);

    return res.json({
      success: true,
      count,
    });

  } catch (error) {
    console.log("Unread count error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get unread count",
    });
  }
};
