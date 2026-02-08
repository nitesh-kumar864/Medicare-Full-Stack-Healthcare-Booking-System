import socket from "../socket";

export const joinDoctorRoom = (appointmentId) => {
  socket.emit("join-room", { appointmentId });

  socket.on("join-success", (data) => {
    console.log("Doctor joined room:", data.appointmentId);
  });

  socket.on("join-error", (msg) => {
    console.error("Join room failed:", msg);
  });
};
