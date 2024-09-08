import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import { router } from "./routes";
import { gooseConnect } from "./config/mongoose";
import { Server } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import { socketFunc } from "./services/socket";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const app = express();
export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

(async () => {
  await gooseConnect();
})();

const PORT = process.env.PORT || 3000;

socketFunc(io);

app.use("/", router);

server.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
});
