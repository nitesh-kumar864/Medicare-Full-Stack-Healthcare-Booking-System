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