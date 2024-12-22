import { Server, Socket } from "socket.io";
import http from "http";
import prismaClient from "../config/db.config";

const userSocketMap = new Map<string, string>();

export function initializeSocket(server: http.Server): Server {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("register", ({ userId, name }) => {
      userSocketMap.set(userId, socket.id);
      console.log(
        `User ${name} registered: ${userId} with socket id: ${socket.id}`
      );
    });

    socket.on(
      "message",
      async ({ userId, partnerId, message, name, image }) => {
        console.log(
          "Message received:",
          message,
          partnerId,
          message,
          name,
          image
        );
        await prismaClient.messages.create({
          data: {
            name: name,
            image: image,
            message: message,
            receiverId: partnerId,
            senderId: userId,
          },
        });

        const partnerSocketId = userSocketMap.get(partnerId);
        if (partnerSocketId) {
          io.to(partnerSocketId).emit("message", {
            userId,
            message,
            name,
            image,
          });
        }
        io.to(socket.id).emit("message", {
          userId,
          message,
          name,
          image,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      for (let [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} removed from map`);
          break;
        }
      }
    });
  });

  return io;
}
