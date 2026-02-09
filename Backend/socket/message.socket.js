import messageModel from "../models/messageModel.js";

export const registerMessageHandlers = (io, socket) => {

  socket.on("send-message", async ({ appointmentId, text }) => {
    try {
      if (!socket.user || !socket.user.id) {
        console.log("Message blocked: unauthenticated socket");
        return;
      }

      if (!appointmentId || !text?.trim()) return;

      const message = await messageModel.create({
        appointmentId,
        senderId: socket.user.id,    
        senderRole: socket.user.role,
        text: text.trim(),
      });

      io.to(appointmentId).emit("new-message", {
        _id: message._id,
        appointmentId,
        text: message.text,
        senderRole: message.senderRole,
        createdAt: message.createdAt,
      });

    } catch (err) {
      console.error("Send message error:", err.message);
    }
  });

};
