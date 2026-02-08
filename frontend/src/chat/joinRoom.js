import socket from "../socket";

export const joinAppointmentRoom = (appointmentId) => {
  if (!appointmentId) return;
  socket.emit("join-room", { appointmentId });

  socket.once("join-success", (data) => {
    console.log("joined room:", data.appointmentId);
  });

  socket.once("join-error", (err) => {
    console.error("join failed:", err);
  });
};
