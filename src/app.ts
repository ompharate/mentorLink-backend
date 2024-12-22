import express, { Application, Request, Response } from "express";
import Routes from "./routes/route.js";
import cors from "cors";
const app: Application = express();
import "dotenv/config";
import { Server } from "socket.io";
import http from "http";
import prismaClient from "./config/db.config.js";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map<string, string>();

app.get("/", (req: any, res: any) => {
  return res.send("It's working 🙌");
});

io.on("connection", (socket) => {
 
  socket.on("register", ({ userId ,name}) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${name} registered: ${userId} with socket id: ${socket.id}`);
  });

  socket.on("message", async ({ userId, partnerId, message }) => {
    console.log("Message received:", message, partnerId, message);
    await prismaClient.messages.create({
      data: {
        message: message,
        receiverId: partnerId,
        senderId: userId,
      },
    });

    const partnerSocketId = userSocketMap.get(partnerId);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit("message", { userId, message });
    } else {
      console.log(`Partner with id ${partnerId} is not connected`);
    }
  });

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

app.use("/api", Routes);

server.listen(8080, () => console.log("server listening on port 8080"));
