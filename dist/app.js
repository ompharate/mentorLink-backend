import express from "express";
import Routes from "./routes/route.js";
import cors from "cors";
const app = express();
import "dotenv/config";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    return res.send("It's working 🙌");
});
app.use("/api", Routes);
app.listen(8080, () => console.log("server listening on port 8080"));
