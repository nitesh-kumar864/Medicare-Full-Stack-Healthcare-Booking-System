import messageModel from "../models/messageModel.js";

export const getMessageByAppointmentService = async (appointmentId) => {
    if (!appointmentId) {
        throw new Error("AppointmentId is required");
    }
    const message = await messageModel
        .find({ appointmentId })
        .sort({ createdAt: 1 })
    return message;
};

export const getUnreadCountService = async (appointmentId, role) => {

  if (!appointmentId) {
    throw new Error("AppointmentId is required");
  }

  if (!role) {
    throw new Error("Role is required");
  }

  const count = await messageModel.countDocuments({
    appointmentId,
    senderRole: { $ne: role },
    seen: false,
  });

  return count;
};