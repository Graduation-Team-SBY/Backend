import { Router } from "express";
import { authentication } from "../middlewares/authentication";
import { Controller as WorkerController } from "../controllers/worker";

export const router = Router();

router.post("/", authentication, WorkerController.createWorker);
router.get("/:workerId", authentication, WorkerController.getWorkerById);
router.get("/:workerId/reviews", authentication, WorkerController.getWorkerReviews);
