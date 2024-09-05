import { Router, Request, Response } from "express";
import { authentication } from "../middlewares/authentication";
import { Controller as ProfileController } from "../controllers/profile";

export const router = Router();

router.get("/", authentication, ProfileController.getProfile);
router.post("/", authentication, ProfileController.getProfile);
