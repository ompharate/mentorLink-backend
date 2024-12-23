import { Server } from "socket.io";
import prismaClient from "../config/db.config.js";
const userSocketMap = new Map();
const userSocketMapVideo = new Map();
export function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        socket.on("register", ({ userId, name }) => {
            userSocketMap.set(userId, socket.id);
        });
        socket.on("registerVideo", ({ userId, partnerId, name }) => {
            let id;
            if (userSocketMapVideo.has(userId)) {
                id = userSocketMapVideo.get(userId);
                io.to(socket.id).emit("video", { id });
                return;
            }
            if (userSocketMapVideo.has(partnerId)) {
                id = userSocketMapVideo.get(partnerId);
                io.to(socket.id).emit("video", { id });
                return;
            }
            userSocketMapVideo.set(userId, socket.id);
            io.to(socket.id).emit("video", { id: socket.id });
        });
        socket.on("message", async ({ userId, partnerId, message, name, image }) => {
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
        });
        socket.on("disconnect", () => {
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });
    });
    return io;
}
