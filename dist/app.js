import express from "express";
import Routes from "./routes/route.js";
import cors from "cors";
const app = express();
import "dotenv/config";
import http from "http";
import { initializeSocket } from "./socket/socket.js";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
app.get("/", (req, res) => {
    return res.send("It's working 🙌");
});
initializeSocket(server);
app.use("/api", Routes);
server.listen(8080, () => console.log("server listening on port 8080"));
