import { Router } from "express";
import multer from "multer";
import { Controller as JobController } from "../controllers/job";
import { authentication, authWorker } from "../middlewares/authentication";

export const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/active", authentication, JobController.activeJobsClient);
router.get('/worker', authWorker, JobController.allJobsWorker)
router.post("/bersih", authentication, upload.array("image", 4), JobController.createJobBersih);
router.post("/belanja", authentication, JobController.createJobBelanja);
router.get('/:jobId', authentication, JobController.jobDetail); // ! enaknya diakses worker doang atau user juga
router.post('/:jobId', authWorker, JobController.applyJob);
router.get('/:jobId/workers', authentication, JobController.getWorkerList)