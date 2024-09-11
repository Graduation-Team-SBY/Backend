import { Request, Response, Router } from "express";
import { errorHandler } from "../middlewares/errorhandler";
import Controller from "../controllers";
import { Controller as JobController } from "../controllers/job";
import { router as jobRouter } from "./job";
import { router as profileRouter } from "./profile";
import { router as workerRouter } from "./worker";
import { router as paymentRouter } from "./payment";
import { router as clientRouter } from "./client";
import { authentication } from "../middlewares/authentication";
export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running..." });
});

router.post("/login", Controller.login);
router.use("/jobs", jobRouter);
router.use("/profile", profileRouter);
router.use('/clients', clientRouter);
router.use("/workers", workerRouter);
router.use("/payment", paymentRouter);
router.get("/chat/:jobId", authentication, JobController.getChatByJobId)
router.use(errorHandler);
