import { Request, Response, Router } from "express";
import { errorHandler } from "../middlewares/errorhandler";
import Controller from "../controllers";
import { router as jobRouter } from "./job";
import { router as profileRouter } from "./profile";
export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running..." });
});

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.use("/jobs", jobRouter);
router.use("/profile", profileRouter);
router.use(errorHandler);
