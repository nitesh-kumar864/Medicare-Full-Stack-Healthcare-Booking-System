import messageModel from "../models/messageModel.js";

export const registerMessageHandlers = (io, socket) => {

socket.on("send-message", async ({ appointmentId, text, type, fileUrl }) => {
  try {
    if (!socket.user || !socket.user.id) {
      console.log("Message blocked: unauthenticated socket");
      return;
    }

    if (!appointmentId) return;

    // allow either text OR file
    if (!text?.trim() && !fileUrl) return;

    const message = await messageModel.create({
      appointmentId,
      senderId: socket.user.id,
      senderRole: socket.user.role,
      text: text?.trim() || "",
      type: type || "text",
      fileUrl: fileUrl || null,
      seen: false,
    });

    io.to(appointmentId).emit("new-message", {
      _id: message._id,
      appointmentId: message.appointmentId,
      text: message.text,
      type: message.type,
      fileUrl: message.fileUrl,
      senderRole: message.senderRole,
      createdAt: message.createdAt,
      seen: false,
    });

  } catch (err) {
    console.error("Send message error:", err.message);
  }
});

  // mark as seen
  socket.on("mark-seen", async ({ appointmentId }) => {
    try {
      if (!appointmentId) return;

      await messageModel.updateMany(
        {
          appointmentId,
          senderRole: { $ne: socket.user.role },
          seen: false,
        },
        {
          $set: {
            seen: true,
            seenAt: new Date(),
          },
        });

      io.to(appointmentId).emit("messages-seen", {
        appointmentId,
        seenBy: socket.user.role,
      });

    } catch (err) {
      console.log("seen error", err.message);
    }
  });
};
