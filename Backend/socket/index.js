import { Server } from "socket.io";
import { socketAuth } from "./auth.socket.js";
import { registerRoomHandlers } from "./room.socket.js";
import { registerMessageHandlers } from "./message.socket.js";
import { RegisterTypingHandlers } from "./typing.socket.js";

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

  // AUTH MIDDLEWARE
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(
      socket.user?.role === "doctor"
        ? `Doctor socket connected: ${socket.user.id}`
        : socket.user?.role === "user"
        ? `User socket connected: ${socket.user.id}`
        : "Guest socket connected"
    );

    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
    RegisterTypingHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};
