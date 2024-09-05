import { Router } from "express";
import { authentication } from "../middlewares/authentication";
import { Controller as ProfileController } from "../controllers/profile";
import multer from "multer";

export const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", authentication, ProfileController.getProfile);
router.patch("/", authentication, upload.single("image"), ProfileController.updateProfile);
router.get("/histories", authentication, ProfileController.getOrderHistories);
router.get("/wallet", authentication, ProfileController.getWallet);
router.patch("/wallet", authentication, ProfileController.updateWallet);
