import { Router } from "express";
import { authentication, authWorker } from "../middlewares/authentication";
import { Controller as WorkerController } from "../controllers/worker";
import { Controller as JobController } from "../controllers/job";
import { authorWorker } from "../middlewares/authorization";
import Controller from "../controllers";

export const router = Router();
router.post("/register", Controller.workerRegister);
router.get('/jobs/worker', authWorker, JobController.allJobsWorker);
router.patch('/jobs/:jobId/worker', authWorker, authorWorker, JobController.workerConfirm);
router.post('/jobs/:jobId', authWorker, JobController.applyJob);
router.get("/:workerId", authentication, WorkerController.getWorkerById);
router.get("/:workerId/reviews", authentication, WorkerController.getWorkerReviews);