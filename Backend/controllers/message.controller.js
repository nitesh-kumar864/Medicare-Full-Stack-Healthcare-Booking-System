import {
  getMessageByAppointmentService,
  getUnreadCountService
} from "../services/message.service.js";

export const getMessageByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const messages = await getMessageByAppointmentService(appointmentId);

    return res.json({
      success: true,
      messages,
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
