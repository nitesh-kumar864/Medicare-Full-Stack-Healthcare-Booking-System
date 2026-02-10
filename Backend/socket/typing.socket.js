
export const RegisterTypingHandlers = (io, socket) => {
    socket.on("typing-start", ({ appointmentId}) => {
        if (!appointmentId) {
            return ;
        }
        socket.to(appointmentId).emit("typing-status",{
            role: socket.user.role,
            typing: true,
        });
    });

    socket.on("typing-stop", ({ appointmentId}) => {
        if (!appointmentId) {
            return
        }

        socket.to(appointmentId).emit("typing-status", {
            role: socket.user.role,
            typing: false,
        });
    });
};
