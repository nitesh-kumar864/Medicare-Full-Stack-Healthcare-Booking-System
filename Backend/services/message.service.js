import messageModel from "../models/messageModel.js";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

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

export const uploadChatFileService = async (appointmentId, file) => {
  try {
    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    if (!file) {
      throw new Error("No file uploaded");
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "medicare/chat",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    const type =
      result.resource_type === "image"
        ? "image"
        : result.format === "pdf"
          ? "pdf"
          : "unknown";

    return {
      fileUrl: result.secure_url,
      type,
    };

  } catch (error) {
    throw error;
  }
};