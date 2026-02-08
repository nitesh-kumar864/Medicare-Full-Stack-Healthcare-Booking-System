import { Server } from "socket.io";
import { socketAuth } from "./auth.socket.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173", 
        "http://localhost:5174",
        "https://medicare-pr8s.onrender.com",
        "https://medicare-admin-a2zd.onrender.com",
      ],
      credentials: true,
    },
  });

 
  io.use((socket, next) => {
    const { dtoken } = socket.handshake.auth || {};

    if (dtoken) {
      return socketAuth(socket, next);
    }

    // User socket
    socket.user = {
      role: "user",
    };
    return next();
  });

  io.on("connection", (socket) => {
    console.log(
      socket.user?.role === "doctor"
        ? `Doctor socket authenticated: ${socket.user.id}`
        : `User socket connected: ${socket.id}`
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};
