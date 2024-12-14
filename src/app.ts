import express, { Application, Request, Response } from "express";
import Routes from "./routes/route.js";
import cors from "cors";
const app: Application = express();
import "dotenv/config";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: any, res: any) => {
  return res.send("It's working 🙌");
});

app.use("/api", Routes);

app.listen(8080, () => console.log("server listening on port 8080"));