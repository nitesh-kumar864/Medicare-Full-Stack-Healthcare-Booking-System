import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const dtoken = socket.handshake.auth?.dtoken;

    if (!token && !dtoken) {
      return next(new Error("Not authenticated"));
    }

    // USER
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = {
        id: decoded.userId,
        role: "user",
      };
      return next();
    }

    // DOCTOR
    if (dtoken) {
      const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
      socket.user = {
        id: decoded.id,
        role: "doctor",
      };
      return next();
    }
  } catch (err) {
    return next(new Error("Invalid token"));
  }
};
