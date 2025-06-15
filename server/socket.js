import { Server } from 'socket.io';

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    // console.log("A user connected");

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);
      // console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    socket.on("sendNotification", ({ recipientId, message }) => {
      const socketId = onlineUsers.get(recipientId);
      if (socketId) {
        io.to(socketId).emit("getNotification", { message });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      // console.log("User disconnected");
    });
  });
};
