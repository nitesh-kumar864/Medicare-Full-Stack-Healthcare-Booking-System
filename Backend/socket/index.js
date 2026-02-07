import { Server } from "socket.io";

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

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export { io };
