import appointmentModel from "../models/appointmentModel.js";

export const registerRoomHandlers = (io, socket) => {

  socket.on("join-room", async ({ appointmentId }) => {
    try {
      if (!appointmentId) {
        return socket.emit("join-error", "Appointment ID required");
      }

      const appointment = await appointmentModel.findById(appointmentId);
      if (!appointment) {
        return socket.emit("join-error", "Appointment not found");
      }

      if (appointment.cancelled || appointment.status === "cancelled") {
        return socket.emit("join-error", "Appointment cancelled");
      }

      if (socket.user.role === "doctor") {
        if (appointment.docId.toString() !== socket.user.id) {
          return socket.emit("join-error", "Doctor not allowed");
        }
      }

      if (socket.user.role === "user") {
        if (appointment.userId.toString() !== socket.user.id) {
          return socket.emit("join-error", "User not allowed");
        }
      }

      if (socket.user.role === "guest") {
        return socket.emit("join-error", "Not authenticated");
      }

      // JOIN ROOM
      socket.join(appointmentId);

      socket.emit("join-success", {
        appointmentId,
        role: socket.user.role,
      });

      console.log(
        `${socket.user.role} joined room ${appointmentId}`
      );

    } catch (err) {
      console.error("Join room error:", err.message);
      socket.emit("join-error", "Internal server error");
    }
  });

};
