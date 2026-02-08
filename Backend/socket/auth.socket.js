import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
  try {
    const { dtoken } = socket.handshake.auth || {};

    if (!dtoken) {
      return next(new Error("Doctor token missing"));
    }

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    socket.user = {
      id: decoded.id,
      role: "doctor",
    };

    return next();
  } catch (error) {
    return next(new Error("Socket authentication failed"));
  }
};
