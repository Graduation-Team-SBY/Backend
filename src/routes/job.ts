import { Router } from "express";
import { Controller as JobController } from "../controllers/job";
import { authentication } from "../middlewares/authentication";

export const router = Router();

router.get('/:jobId', authentication, JobController.jobDetail);