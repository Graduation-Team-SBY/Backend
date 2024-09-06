import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import { router } from "./routes";
import { gooseConnect } from "./config/mongoose";
import cors from "cors"

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

(async () => {
  await gooseConnect();
})();

const PORT = process.env.PORT || 3000;

app.use("/", router);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
