import { Router } from "express";
import { authentication } from "../middlewares/authentication";
import { Controller as JobController } from "../controllers/job";
import multer from "multer";
import { Controller as ProfileController } from "../controllers/profile";
import { authorization } from "../middlewares/authorization";
import Controller from "../controllers";

export const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", Controller.clientRegister);
router.patch("/profile", authentication, upload.single("image"), ProfileController.updateProfileClient);
router.get("/profile", authentication, ProfileController.getProfile);
router.get("/jobs/active", authentication, JobController.activeJobsClient);
router.post("/jobs/bersih", authentication, upload.array("image", 4), JobController.createJobBersih);
router.post("/jobs/belanja", authentication, JobController.createJobBelanja);
router.get("/jobs/:jobId/workers", authentication, JobController.getWorkerList);
router.patch("/jobs/:jobId/client", authentication, authorization, JobController.clientConfirm);
router.post("/jobs/:jobId/review", authentication, authorization, upload.array("image", 4), JobController.createReview);
router.patch("/jobs/:jobId/:workerId", authentication, authorization, JobController.pickWorker);
router.delete("/jobs/:jobId", authentication, authorization, JobController.cancelJob);
