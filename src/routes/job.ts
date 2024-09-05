import { Router, Request, Response } from "express";
import multer from "multer";
import { Controller as JobController } from "../controllers/job";
import { authentication } from "../middlewares/authentication";
import { ObjectId } from "mongodb";

export const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/active", authentication, JobController.activeJobsClient);
// router.get('/worker', auth)
router.post("/bersih", authentication, upload.array("image", 4), JobController.createJobBersih);
router.post("/belanja", authentication, JobController.createJobBelanja);
