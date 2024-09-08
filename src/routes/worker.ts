import { Router } from "express";
import { authentication, authWorker } from "../middlewares/authentication";
import { Controller as WorkerController } from "../controllers/worker";
import { Controller as ProfileController } from "../controllers/profile";
import { Controller as JobController } from "../controllers/job";
import { authorWorker } from "../middlewares/authorization";
import Controller from "../controllers";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const router = Router();
router.post("/register", Controller.workerRegister);
router.get("/profile", authentication, WorkerController.getWorkerById);
router.patch("/profile", authentication, upload.single("image"), ProfileController.updateProfileWorker);
router.get("/profile/reviews", authentication, WorkerController.getWorkerReviews);
router.get('/job', authWorker, JobController.getCurrentJob);
router.get("/jobs/worker", authWorker, JobController.allJobsWorker);
router.patch("/jobs/:jobId/worker", authWorker, authorWorker, upload.array("image", 4), JobController.workerConfirm);
router.post("/jobs/:jobId", authWorker, JobController.applyJob);
