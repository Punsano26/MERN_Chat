import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
  },
});

const userSocketMap = {}; // {userId:socketId}
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A User connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("friendRequestSent", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestReceived", userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("A User disconnected", socket.id);
    delete userSocketMap[userId];
  });

  socket.on("friendRequestAccepted", (friendId) => {
    const receiverSocketId = getReceiverSocketId(friendId);
    console.log("receiverSocketId", receiverSocketId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestAcceptedBySender", userId);
    }
  });
});

export { io, app, server };
