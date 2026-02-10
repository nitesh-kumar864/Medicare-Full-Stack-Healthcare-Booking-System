import { getMessageByAppointmentService } from "../services/message.service.js";

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
