import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  auth: {
    dtoken: localStorage.getItem("dtoken"),
  },
});


export default socket;
